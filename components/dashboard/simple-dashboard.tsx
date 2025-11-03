"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  User, 
  Phone,
  Search,
  Edit,
  Trash2,
  Grid,
  List
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Define the type for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  status: string;
  control_type: string;
  cost: number;
  notes: string;
}

interface SimpleDashboardProps {
  controls: any[];
  patients: any[];
  profile: any;
}

// Define the CalendarWrapper component that will handle dynamic import
const CalendarWrapper = ({ calendarEvents }: { calendarEvents: CalendarEvent[] }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="text-center py-12 text-muted-foreground">Loading calendar...</div>;
  }
  
  // Dynamically load Calendar component after client-side hydration
  const CalendarComponent = (props: any) => {
    const [CalendarMain, setCalendarMain] = useState<any>(null);
    const [localizer, setLocalizer] = useState<any>(null);

    useEffect(() => {
      const loadCalendar = async () => {
        const [bigCalendarModule, momentModule] = await Promise.all([
          import('react-big-calendar'),
          import('moment')
        ]);
        
        const CalendarResolved = bigCalendarModule.default || bigCalendarModule.Calendar;
        const moment = momentModule.default;
        const localizerResolved = bigCalendarModule.momentLocalizer(moment);
        
        setCalendarMain(() => CalendarResolved);
        setLocalizer(() => localizerResolved);
      };
      
      loadCalendar();
    }, []);

    if (!CalendarMain || !localizer) {
      return <div>Loading calendar...</div>;
    }

    // Custom event component
    const CustomEvent = ({ event }: { event: CalendarEvent }) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case "completed":
            return "bg-green-100 border-green-500 text-green-800";
          case "cancelled":
            return "bg-red-100 border-red-500 text-red-800";
          case "no_show":
            return "bg-yellow-100 border-yellow-500 text-yellow-800";
          default:
            return "bg-blue-100 border-blue-500 text-blue-800";
        }
      };
      
      return (
        <div className={`p-1 rounded border text-xs ${getStatusColor(event.status)}`}>
          <div className="font-medium truncate">{event.title}</div>
          <div className="truncate">{event.cost ? `$${event.cost}` : ''}</div>
        </div>
      );
    };
    
    // Custom toolbar component
    const Toolbar = (toolbar: any) => {
      const goToDay = () => {
        toolbar.onNavigate('TODAY');
      };

      const goToPrevious = () => {
        toolbar.onNavigate('PREV');
      };

      const goToNext = () => {
        toolbar.onNavigate('NEXT');
      };

      return (
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Button onClick={goToPrevious} variant="outline" size="sm">
              &lt;
            </Button>
            <Button onClick={goToDay} variant="outline" size="sm">
              Today
            </Button>
            <Button onClick={goToNext} variant="outline" size="sm">
              &gt;
            </Button>
            <h2 className="text-lg font-bold mx-2">
              {new Date(toolbar.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
        </div>
      );
    };
    
    return (
      <CalendarMain
        localizer={localizer}
        events={props.events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        view="month"
        style={{ height: 500 }}
        components={{
          toolbar: Toolbar,
          event: CustomEvent,
        }}
        eventPropGetter={(event: any) => ({
          className: `border-l-4 ${
            event.status === 'completed' 
              ? 'border-green-500' 
              : event.status === 'cancelled' 
                ? 'border-red-500' 
                : event.status === 'no_show' 
                  ? 'border-yellow-500' 
                  : 'border-blue-500'
          }`,
        })}
      />
    );
  };

  return <CalendarComponent events={calendarEvents} />;
};

export function SimpleDashboard({ controls, patients, profile }: SimpleDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table'); // New state for view mode
  const [newControl, setNewControl] = useState({
    patient_id: "",
    control_type: "Checkup",
    scheduled_date: new Date().toISOString().split('T')[0],
    cost: 0,
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform controls data to calendar events format
  const calendarEvents: CalendarEvent[] = controls?.map(control => ({
    id: control.id,
    title: `${control.patients?.first_name} ${control.patients?.last_name} - ${control.control_type}`,
    start: new Date(control.scheduled_date),
    end: new Date(new Date(control.scheduled_date).getTime() + 60 * 60 * 1000), // 1 hour duration
    resourceId: control.patient_id,
    status: control.status,
    control_type: control.control_type,
    cost: control.cost || 0,
    notes: control.notes || '',
  })) || [];

  // Filter controls based on search term
  const filteredControls = controls.filter(control => {
    const patientName = `${control.patients?.first_name} ${control.patients?.last_name}`.toLowerCase();
    const controlType = control.control_type?.toLowerCase() || '';
    return patientName.includes(searchTerm.toLowerCase()) || 
           controlType.includes(searchTerm.toLowerCase());
  });

  const handleAddControl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Validate patient ID is selected
      if (!newControl.patient_id) {
        setError("Please select a patient.");
        setLoading(false);
        return;
      }
      
      // Create the control
      const { data: controlData, error: controlError } = await supabase
        .from('controls')
        .insert([{
          patient_id: newControl.patient_id,
          control_type: newControl.control_type,
          scheduled_date: newControl.scheduled_date,
          cost: newControl.cost,
          notes: newControl.notes,
          status: 'scheduled'
        }])
        .select()
        .single();
      
      if (controlError) throw controlError;
      
      // Create the associated cost record
      if (newControl.cost > 0) {
        const { error: costError } = await supabase
          .from('costs')
          .insert([{
            control_id: controlData.id,
            amount: newControl.cost,
            cost_type: 'control',
            description: `Control fee for ${newControl.control_type}`,
            cost_date: newControl.scheduled_date
          }]);
        
        if (costError) throw costError;
      }
      
      // Reset form
      setNewControl({
        patient_id: "",
        control_type: "Checkup",
        scheduled_date: new Date().toISOString().split('T')[0],
        cost: 0,
        notes: ""
      });
      setShowAddForm(false);
      
      // In a real app, you would refresh the data or add to local state
      // For now, we'll just reload the page
      window.location.reload();
    } catch (err: any) {
      console.error("Error adding control:", err);
      setError(err.message || "Failed to add control. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "no_show":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Section */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="rounded-r-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="rounded-l-none"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button type="button" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Add New Control Form */}
        {showAddForm && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Add New Control</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              
              <form onSubmit={handleAddControl} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select 
                      value={newControl.patient_id} 
                      onValueChange={(value) => setNewControl({...newControl, patient_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="control_type">Control Type</Label>
                    <Select 
                      value={newControl.control_type} 
                      onValueChange={(value) => setNewControl({...newControl, control_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Checkup">Checkup</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Treatment">Treatment</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_date">Control Date</Label>
                    <Input
                      type="date"
                      value={newControl.scheduled_date}
                      onChange={(e) => setNewControl({...newControl, scheduled_date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newControl.cost}
                      onChange={(e) => setNewControl({...newControl, cost: parseFloat(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    placeholder="Additional notes..."
                    value={newControl.notes}
                    onChange={(e) => setNewControl({...newControl, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Adding..." : "Add Control"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Toggleable View - Table or Calendar */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Member Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredControls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No controls found. Add your first control to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Patient</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Cost</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredControls.map((control) => (
                      <tr key={control.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {control.patients 
                                  ? `${control.patients.first_name} ${control.patients.last_name}` 
                                  : `Patient ID: ${control.patient_id} (missing data)`}
                              </div>
                              {control.patients?.phone && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {control.patients.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{control.control_type}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(control.scheduled_date).toISOString().split('T')[0]}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>${(control.cost || 0).toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className={getStatusColor(control.status)}>
                            {control.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Control Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarWrapper calendarEvents={calendarEvents} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}