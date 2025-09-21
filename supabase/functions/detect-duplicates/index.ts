import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportData {
  title: string;
  description: string;
  location_name: string;
  category_id: number;
  latitude?: number;
  longitude?: number;
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { report }: { report: ReportData } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Processing duplicate detection for report:', report.title);

    // Get recent reports from the same category
    const { data: recentReports, error: fetchError } = await supabase
      .from('reports')
      .select('id, title, description, location_name, latitude, longitude, upvotes, created_at')
      .eq('category_id', report.category_id)
      .eq('is_duplicate', false)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('created_at', { ascending: false })
      .limit(20);

    if (fetchError) {
      console.error('Error fetching recent reports:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${recentReports?.length || 0} recent reports to compare`);

    if (!recentReports || recentReports.length === 0) {
      return new Response(JSON.stringify({
        isDuplicate: false,
        parentReportId: null,
        confidence: 0,
        analysis: 'No recent reports found for comparison'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate location similarity
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Find potential duplicates using simple text and location matching
    let bestMatch = null;
    let highestSimilarity = 0;

    for (const existingReport of recentReports) {
      let similarity = 0;
      
      // Text similarity (simple keyword matching)
      const newReportText = `${report.title} ${report.description}`.toLowerCase();
      const existingReportText = `${existingReport.title} ${existingReport.description}`.toLowerCase();
      
      const newWords = newReportText.split(/\s+/).filter(word => word.length > 3);
      const existingWords = existingReportText.split(/\s+/).filter(word => word.length > 3);
      
      let commonWords = 0;
      for (const word of newWords) {
        if (existingWords.includes(word)) {
          commonWords++;
        }
      }
      
      const textSimilarity = commonWords / Math.max(newWords.length, existingWords.length);
      similarity += textSimilarity * 0.6; // 60% weight for text similarity
      
      // Location similarity
      if (report.latitude && report.longitude && existingReport.latitude && existingReport.longitude) {
        const distance = calculateDistance(
          report.latitude, report.longitude,
          existingReport.latitude, existingReport.longitude
        );
        
        // Consider reports within 1km as potentially same location
        const locationSimilarity = Math.max(0, 1 - (distance / 1.0));
        similarity += locationSimilarity * 0.4; // 40% weight for location similarity
      } else {
        // Simple location name matching if coordinates not available
        const locationSimilarity = report.location_name.toLowerCase() === existingReport.location_name.toLowerCase() ? 1 : 0;
        similarity += locationSimilarity * 0.3; // 30% weight for location name matching
      }
      
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = existingReport;
      }
    }

    // Use AI for better analysis if OpenAI API key is available and similarity is borderline
    let aiAnalysis = null;
    if (openAIApiKey && highestSimilarity > 0.3 && highestSimilarity < 0.8 && bestMatch) {
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a civic issue analysis expert. Your job is to determine if two reported issues are duplicates of each other. Consider location, issue type, description details, and severity. Respond with a JSON object containing "isDuplicate" (boolean), "confidence" (0-1), and "reasoning" (string).'
              },
              {
                role: 'user',
                content: `Compare these two civic issue reports:

NEW REPORT:
Title: ${report.title}
Description: ${report.description}
Location: ${report.location_name}

EXISTING REPORT:
Title: ${bestMatch.title}
Description: ${bestMatch.description}
Location: ${bestMatch.location_name}
Upvotes: ${bestMatch.upvotes}
Created: ${bestMatch.created_at}

Are these the same issue?`
              }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const aiResult = JSON.parse(aiData.choices[0].message.content);
          aiAnalysis = aiResult;
          
          // Update similarity based on AI confidence
          if (aiAnalysis.isDuplicate && aiAnalysis.confidence > 0.7) {
            highestSimilarity = Math.max(highestSimilarity, aiAnalysis.confidence);
          }
        }
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
      }
    }

    const isDuplicate = highestSimilarity > 0.6; // 60% similarity threshold
    const parentReportId = isDuplicate ? bestMatch?.id : null;

    console.log(`Duplicate detection result: ${isDuplicate}, confidence: ${highestSimilarity}`);

    // If it's a duplicate, increment the upvotes of the parent report
    if (isDuplicate && parentReportId) {
      const { error: updateError } = await supabase
        .from('reports')
        .update({ 
          upvotes: bestMatch!.upvotes + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', parentReportId);

      if (updateError) {
        console.error('Error updating parent report votes:', updateError);
      } else {
        console.log(`Incremented votes for parent report ${parentReportId}`);
      }
    }

    return new Response(JSON.stringify({
      isDuplicate,
      parentReportId,
      confidence: Math.round(highestSimilarity * 100) / 100,
      analysis: aiAnalysis?.reasoning || `Text similarity: ${Math.round(highestSimilarity * 100)}%`,
      matchedReport: isDuplicate ? {
        id: bestMatch?.id,
        title: bestMatch?.title,
        upvotes: bestMatch?.upvotes
      } : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in detect-duplicates function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isDuplicate: false,
        parentReportId: null,
        confidence: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});