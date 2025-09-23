import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Upload, Clock, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

interface OfflineReport {
  id: string;
  title: string;
  description: string;
  location_name: string;
  category_id: number;
  urgency_level: string;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
}

const MobileOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineReports, setOfflineReports] = useState<OfflineReport[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored! Syncing offline data...");
      syncOfflineData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Connection lost. Reports will be saved offline.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline reports from localStorage
    loadOfflineReports();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineReports = () => {
    try {
      const stored = localStorage.getItem('offlineReports');
      if (stored) {
        setOfflineReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline reports:', error);
    }
  };

  const saveOfflineReports = (reports: OfflineReport[]) => {
    try {
      localStorage.setItem('offlineReports', JSON.stringify(reports));
      setOfflineReports(reports);
    } catch (error) {
      console.error('Error saving offline reports:', error);
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline || syncing) return;
    
    setSyncing(true);
    const pendingReports = offlineReports.filter(report => report.status === 'pending');
    
    if (pendingReports.length === 0) {
      setSyncing(false);
      return;
    }

    // Simulate syncing process
    for (const report of pendingReports) {
      try {
        // Here you would normally make the API call to sync the report
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        const updatedReports = offlineReports.map(r => 
          r.id === report.id ? { ...r, status: 'synced' as const } : r
        );
        saveOfflineReports(updatedReports);
      } catch (error) {
        const updatedReports = offlineReports.map(r => 
          r.id === report.id ? { ...r, status: 'failed' as const } : r
        );
        saveOfflineReports(updatedReports);
      }
    }
    
    setSyncing(false);
    toast.success(`${pendingReports.length} reports synced successfully!`);
  };

  const clearSyncedReports = () => {
    const pendingReports = offlineReports.filter(report => report.status !== 'synced');
    saveOfflineReports(pendingReports);
    toast.success("Synced reports cleared");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Connection Status */}
      <Card className={`border-2 ${isOnline ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <Wifi className="h-6 w-6 text-green-600" />
              ) : (
                <WifiOff className="h-6 w-6 text-red-600" />
              )}
              <div>
                <h3 className={`font-semibold ${isOnline ? 'text-green-800' : 'text-red-800'}`}>
                  {isOnline ? 'Connected' : 'Offline Mode'}
                </h3>
                <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline 
                    ? 'All features available' 
                    : 'Reports will be saved locally and synced when connection is restored'
                  }
                </p>
              </div>
            </div>
            
            {isOnline && offlineReports.some(r => r.status === 'pending') && (
              <Button
                onClick={syncOfflineData}
                disabled={syncing}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                {syncing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Syncing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Sync Now</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offline Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Offline Reports</CardTitle>
              <CardDescription>Reports saved locally waiting for sync</CardDescription>
            </div>
            {offlineReports.some(r => r.status === 'synced') && (
              <Button variant="outline" size="sm" onClick={clearSyncedReports}>
                Clear Synced
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {offlineReports.length === 0 ? (
            <div className="text-center py-8">
              <WifiOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No offline reports</p>
              <p className="text-sm text-muted-foreground mt-1">
                Reports created while offline will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {offlineReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{report.title}</h4>
                    <div className="flex items-center space-x-2">
                      {report.status === 'synced' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {report.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                      {report.status === 'failed' && <WifiOff className="h-4 w-4 text-red-600" />}
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>📍 {report.location_name}</span>
                    <span>{formatTimestamp(report.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Information</CardTitle>
          <CardDescription>Local storage usage and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Offline Reports</span>
              <Badge variant="outline">{offlineReports.length} items</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Pending Sync</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                {offlineReports.filter(r => r.status === 'pending').length} items
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Synced</span>
              <Badge variant="outline" className="bg-green-50 text-green-800">
                {offlineReports.filter(r => r.status === 'synced').length} items
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileOffline;