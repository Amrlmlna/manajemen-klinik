"use client";

import { useState, useEffect, useRef } from "react";
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

// Import the calendar CSS styles
import "react-big-calendar/lib/css/react-big-calendar.css";

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

interface Control {
  id: string;
  patient_id: string;
  control_type: string;
  scheduled_date: string;
  status: string;
  cost: number | null;
  notes: string | null;
  patients: any;
}

interface Schedule {
  id: string;
  patient_id: string;
  control_type: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  cost: number | null;
  patients: any;
}

interface SimpleDashboardProps {
  controls: Control[];
  schedules: Schedule[];
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
          <div className="truncate">{event.cost ? `Rp${event.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}</div>
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

export function SimpleDashboard({ controls: initialControls, schedules: initialSchedules, patients, profile }: SimpleDashboardProps) {
  const [controls, setControls] = useState(initialControls);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'calendar' | 'patients'>('table'); // New state for view mode (default to table view)
  const [addDropdownOpen, setAddDropdownOpen] = useState(false); // State for the add dropdown
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const [newControl, setNewControl] = useState({
    patient_id: "",
    control_type: "Checkup",
    scheduled_date: new Date().toISOString().split('T')[0],
    cost: 0,
    notes: ""
  });
  // New patient data for control form
  const [newPatientForControl, setNewPatientForControl] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [createNewPatientForControl, setCreateNewPatientForControl] = useState(false);
  
  const [newSchedule, setNewSchedule] = useState({
    patient_id: "",
    control_type: "Checkup",
    frequency: "weekly",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    cost: 0,
    notes: ""
  });
  // State for editing existing controls
  const [editingControl, setEditingControl] = useState<any>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [showEditControlForm, setShowEditControlForm] = useState(false);
  const [showEditScheduleForm, setShowEditScheduleForm] = useState(false);
  
  // New patient data for schedule form
  const [newPatientForSchedule, setNewPatientForSchedule] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [createNewPatientForSchedule, setCreateNewPatientForSchedule] = useState(false);
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change (in case parent re-renders with new data)
  useEffect(() => {
    setControls(initialControls);
  }, [initialControls]);

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  // Transform controls data to calendar events format
  const calendarEvents: CalendarEvent[] = [
    ...controls?.map(control => ({
      id: control.id,
      title: `${control.patients?.first_name} ${control.patients?.last_name} - ${control.control_type}`,
      start: new Date(control.scheduled_date),
      end: new Date(new Date(control.scheduled_date).getTime() + 60 * 60 * 1000), // 1 hour duration
      resourceId: control.patient_id,
      status: control.status,
      control_type: control.control_type,
      cost: control.cost || 0,
      notes: control.notes || '',
    })) || [],
    // Add recurring schedule events (this is a simplified representation)
    ...schedules?.filter(schedule => schedule.is_active).map(schedule => ({
      id: `schedule-${schedule.id}`,
      title: `${schedule.patients?.first_name} ${schedule.patients?.last_name} - ${schedule.control_type} (Schedule)`,
      start: new Date(schedule.start_date),
      end: new Date(new Date(schedule.start_date).getTime() + 60 * 60 * 1000), // 1 hour duration
      resourceId: schedule.patient_id,
      status: 'scheduled',
      control_type: schedule.control_type,
      cost: schedule.cost || 0,
      notes: `Recurring ${schedule.frequency} schedule`,
    })) || []
  ];

  // Filter controls based on search term
  const filteredControls = controls.filter(control => {
    const patientName = `${control.patients?.first_name} ${control.patients?.last_name}`.toLowerCase();
    const controlType = control.control_type?.toLowerCase() || '';
    return patientName.includes(searchTerm.toLowerCase()) || 
           controlType.includes(searchTerm.toLowerCase());
  });

  // Function to create a new patient
  const createNewPatient = async (patientData: { first_name: string; last_name: string; email?: string; phone?: string }) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        email: patientData.email || null,
        phone: patientData.phone || null,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  };

  // Function to update an existing control
  const updateControl = async (controlId: string, updatedData: any) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('controls')
      .update(updatedData)
      .eq('id', controlId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  };

  // Function to update an existing schedule
  const updateSchedule = async (scheduleId: string, updatedData: any) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('control_schedules')
      .update(updatedData)
      .eq('id', scheduleId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  };

  // Handle editing a control
  const handleEditControl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store current control data to avoid race conditions
    const currentControl = editingControl;
    if (!currentControl || !currentControl.id) {
      setError("Control data is not available for editing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Update the control
      const { data: updatedControl, error: updateError } = await updateControl(currentControl.id, {
        patient_id: currentControl.patient_id,
        control_type: currentControl.control_type,
        scheduled_date: currentControl.scheduled_date,
        status: currentControl.status,
        cost: currentControl.cost,
        notes: currentControl.notes,
      });

      if (updateError) throw updateError;

      // Update the associated cost record if it exists
      if (updatedControl && updatedControl.cost && updatedControl.cost > 0) {
        const { error: costError } = await supabase
          .from('costs')
          .upsert({
            control_id: updatedControl.id,
            amount: updatedControl.cost,
            cost_type: 'control',
            description: `Control fee for ${updatedControl.control_type}`,
            cost_date: updatedControl.scheduled_date
          });

        if (costError) throw costError;
      }

      // Update the control in the local state (without reloading)
      if (updatedControl) {
        setControls(prevControls => 
          prevControls.map(control => 
            control.id === updatedControl.id ? updatedControl : control
          )
        );
      }

      // Reset form
      setEditingControl(null);
      setShowEditControlForm(false);
      
      // Show success feedback (optional)
      // You could implement a toast notification here
    } catch (err: any) {
      console.error("Error updating control:", err);
      setError(err.message || "Failed to update control. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a schedule
  const handleEditSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store current schedule data to avoid race conditions
    const currentSchedule = editingSchedule;
    if (!currentSchedule || !currentSchedule.id) {
      setError("Schedule data is not available for editing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update the schedule
      const { data: updatedSchedule, error: updateError } = await updateSchedule(currentSchedule.id, {
        patient_id: currentSchedule.patient_id,
        control_type: currentSchedule.control_type,
        frequency: currentSchedule.frequency,
        start_date: currentSchedule.start_date,
        end_date: currentSchedule.end_date || null,
        cost: currentSchedule.cost,
        is_active: currentSchedule.is_active,
      });

      if (updateError) throw updateError;

      // Update the schedule in the local state (without reloading)
      if (updatedSchedule) {
        setSchedules(prevSchedules => 
          prevSchedules.map(schedule => 
            schedule.id === updatedSchedule.id ? updatedSchedule : schedule
          )
        );
      }

      // Reset form
      setEditingSchedule(null);
      setShowEditScheduleForm(false);
      
      // Show success feedback (optional)
      // You could implement a toast notification here
    } catch (err: any) {
      console.error("Error updating schedule:", err);
      setError(err.message || "Failed to update schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddControl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      let patientId = newControl.patient_id;
      
      // Check if we need to create a new patient
      if (createNewPatientForControl) {
        if (!newPatientForControl.first_name || !newPatientForControl.last_name) {
          setError("Please enter both first name and last name for the new patient.");
          setLoading(false);
          return;
        }
        
        // Create new patient
        const newPatient = await createNewPatient(newPatientForControl);
        patientId = newPatient.id;
        
        // Update the patients list for the form
        // In a real app, we'd update the state to include the new patient
      } else {
        // Validate patient ID is selected
        if (!patientId) {
          setError("Please select a patient.");
          setLoading(false);
          return;
        }
      }
      
      // Create the control
      const { data: controlData, error: controlError } = await supabase
        .from('controls')
        .insert([{
          patient_id: patientId,
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
      setNewPatientForControl({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      setCreateNewPatientForControl(false);
      setShowAddForm(false);
      
      // Add the new control to the local state (without reloading)
      if (controlData) {
        setControls(prevControls => [...prevControls, controlData]);
      }
    } catch (err: any) {
      console.error("Error adding control:", err);
      setError(err.message || "Failed to add control. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      let patientId = newSchedule.patient_id;
      
      // Check if we need to create a new patient
      if (createNewPatientForSchedule) {
        if (!newPatientForSchedule.first_name || !newPatientForSchedule.last_name) {
          setError("Please enter both first name and last name for the new patient.");
          setLoading(false);
          return;
        }
        
        // Create new patient
        const newPatient = await createNewPatient(newPatientForSchedule);
        patientId = newPatient.id;
      } else {
        // Validate patient ID is selected
        if (!patientId) {
          setError("Please select a patient.");
          setLoading(false);
          return;
        }
      }
      
      // Create the schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('control_schedules')
        .insert([{
          patient_id: patientId,
          control_type: newSchedule.control_type,
          frequency: newSchedule.frequency,
          start_date: newSchedule.start_date,
          end_date: newSchedule.end_date || null,
          cost: newSchedule.cost,
          is_active: true
        }])
        .select()
        .single();
      
      if (scheduleError) throw scheduleError;
      
      // Reset form
      setNewSchedule({
        patient_id: "",
        control_type: "Checkup",
        frequency: "weekly",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        cost: 0,
        notes: ""
      });
      setNewPatientForSchedule({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      setCreateNewPatientForSchedule(false);
      setShowAddScheduleForm(false);
      
      // Add the new schedule to the local state (without reloading)
      if (scheduleData) {
        setSchedules(prevSchedules => [...prevSchedules, scheduleData]);
      }
    } catch (err: any) {
      console.error("Error adding schedule:", err);
      setError(err.message || "Failed to add schedule. Please try again.");
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

  // Group controls and schedules by patient
  const groupedByPatient: Record<string, { patient: any; controls: Control[]; schedules: Schedule[] }> = {};
  
  // Initialize all patients
  patients.forEach(patient => {
    groupedByPatient[patient.id] = {
      patient,
      controls: [],
      schedules: []
    };
  });
  
  // Add controls to their respective patients
  controls.forEach(control => {
    if (groupedByPatient[control.patient_id]) {
      groupedByPatient[control.patient_id].controls.push(control);
    }
  });
  
  // Add schedules to their respective patients
  schedules.forEach(schedule => {
    if (groupedByPatient[schedule.patient_id]) {
      groupedByPatient[schedule.patient_id].schedules.push(schedule);
    }
  });
  
  // Filter patients based on search term
  const filteredPatientGroups = Object.values(groupedByPatient).filter(group => {
    const patientName = `${group.patient.first_name} ${group.patient.last_name}`.toLowerCase();
    return patientName.includes(searchTerm.toLowerCase());
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setAddDropdownOpen(false);
      }
    };

    if (addDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addDropdownOpen]);

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
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'patients' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('patients')}
          >
            <User className="h-4 w-4" />
            Members
          </Button>
          <div className="relative" ref={addDropdownRef}>
            <Button 
              type="button"
              onClick={() => setAddDropdownOpen(!addDropdownOpen)}
              aria-expanded={addDropdownOpen}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
            {addDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddForm(true);
                    setShowAddScheduleForm(false);
                    setCreateNewPatientForControl(false); // Default to existing patient
                    setAddDropdownOpen(false); // Close dropdown
                  }}
                >
                  Add Control (Existing Patient)
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddForm(true);
                    setShowAddScheduleForm(false);
                    setCreateNewPatientForControl(true); // Default to new patient
                    setAddDropdownOpen(false); // Close dropdown
                  }}
                >
                  Add Control (New Patient)
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddScheduleForm(true);
                    setShowAddForm(false);
                    setCreateNewPatientForSchedule(false); // Default to existing patient
                    setAddDropdownOpen(false); // Close dropdown
                  }}
                >
                  Add Schedule (Existing Patient)
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddScheduleForm(true);
                    setShowAddForm(false);
                    setCreateNewPatientForSchedule(true); // Default to new patient
                    setAddDropdownOpen(false); // Close dropdown
                  }}
                >
                  Add Schedule (New Patient)
                </button>
              </div>
            )}
          </div>
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
                {/* Patient selection or creation toggle */}
                <div className="flex border rounded-md">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-l-md ${
                      !createNewPatientForControl 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setCreateNewPatientForControl(false)}
                  >
                    Existing Patient
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-r-md ${
                      createNewPatientForControl 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setCreateNewPatientForControl(true)}
                  >
                    New Patient
                  </button>
                </div>
                
                {/* Show patient selection when not creating new patient */}
                {!createNewPatientForControl ? (
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
                ) : (
                  // Show new patient form when creating new patient
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={newPatientForControl.first_name}
                        onChange={(e) => setNewPatientForControl({...newPatientForControl, first_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={newPatientForControl.last_name}
                        onChange={(e) => setNewPatientForControl({...newPatientForControl, last_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newPatientForControl.email}
                        onChange={(e) => setNewPatientForControl({...newPatientForControl, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newPatientForControl.phone}
                        onChange={(e) => setNewPatientForControl({...newPatientForControl, phone: e.target.value})}
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="cost">Cost (Rp)</Label>
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
                    onClick={() => {
                      setShowAddForm(false);
                      setCreateNewPatientForControl(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Add New Schedule Form */}
        {showAddScheduleForm && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Add New Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              
              <form onSubmit={handleAddSchedule} className="space-y-4">
                {/* Patient selection or creation toggle */}
                <div className="flex border rounded-md">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-l-md ${
                      !createNewPatientForSchedule 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setCreateNewPatientForSchedule(false)}
                  >
                    Existing Patient
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm rounded-r-md ${
                      createNewPatientForSchedule 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setCreateNewPatientForSchedule(true)}
                  >
                    New Patient
                  </button>
                </div>
                
                {/* Show patient selection when not creating new patient */}
                {!createNewPatientForSchedule ? (
                  <div className="space-y-2">
                    <Label htmlFor="schedule-patient">Patient</Label>
                    <Select 
                      value={newSchedule.patient_id} 
                      onValueChange={(value) => setNewSchedule({...newSchedule, patient_id: value})}
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
                ) : (
                  // Show new patient form when creating new patient
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={newPatientForSchedule.first_name}
                        onChange={(e) => setNewPatientForSchedule({...newPatientForSchedule, first_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={newPatientForSchedule.last_name}
                        onChange={(e) => setNewPatientForSchedule({...newPatientForSchedule, last_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newPatientForSchedule.email}
                        onChange={(e) => setNewPatientForSchedule({...newPatientForSchedule, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newPatientForSchedule.phone}
                        onChange={(e) => setNewPatientForSchedule({...newPatientForSchedule, phone: e.target.value})}
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="control_type">Control Type</Label>
                    <Select 
                      value={newSchedule.control_type} 
                      onValueChange={(value) => setNewSchedule({...newSchedule, control_type: value})}
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
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select 
                      value={newSchedule.frequency} 
                      onValueChange={(value) => setNewSchedule({...newSchedule, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newSchedule.cost}
                      onChange={(e) => setNewSchedule({...newSchedule, cost: parseFloat(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      type="date"
                      value={newSchedule.start_date}
                      onChange={(e) => setNewSchedule({...newSchedule, start_date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (optional)</Label>
                    <Input
                      type="date"
                      value={newSchedule.end_date}
                      onChange={(e) => setNewSchedule({...newSchedule, end_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Adding..." : "Add Schedule"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setShowAddScheduleForm(false);
                      setCreateNewPatientForSchedule(false);
                    }}
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

      {/* Edit Control Form */}
      {showEditControlForm && editingControl && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Edit Control</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            
            <form onSubmit={handleEditControl} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-patient">Patient</Label>
                  <Select 
                    value={editingControl.patient_id} 
                    onValueChange={(value) => setEditingControl({...editingControl, patient_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="edit-control-type">Control Type</Label>
                  <Select 
                    value={editingControl.control_type} 
                    onValueChange={(value) => setEditingControl({...editingControl, control_type: value})}
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
                  <Label htmlFor="edit-scheduled-date">Control Date</Label>
                  <Input
                    type="date"
                    id="edit-scheduled-date"
                    value={editingControl.scheduled_date.split('T')[0]}
                    onChange={(e) => setEditingControl({...editingControl, scheduled_date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingControl.status} 
                    onValueChange={(value) => setEditingControl({...editingControl, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Cost (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={editingControl.cost || 0}
                    onChange={(e) => setEditingControl({...editingControl, cost: parseFloat(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  placeholder="Additional notes..."
                  value={editingControl.notes || ""}
                  onChange={(e) => setEditingControl({...editingControl, notes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Updating..." : "Update Control"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setShowEditControlForm(false);
                    setEditingControl(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Schedule Form */}
      {showEditScheduleForm && editingSchedule && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Edit Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            
            <form onSubmit={handleEditSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-schedule-type">Control Type</Label>
                  <Select 
                    value={editingSchedule.control_type} 
                    onValueChange={(value) => setEditingSchedule({...editingSchedule, control_type: value})}
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
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select 
                    value={editingSchedule.frequency} 
                    onValueChange={(value) => setEditingSchedule({...editingSchedule, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-start-date">Start Date</Label>
                  <Input
                    type="date"
                    id="edit-start-date"
                    value={editingSchedule.start_date.split('T')[0]}
                    onChange={(e) => setEditingSchedule({...editingSchedule, start_date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-end-date">End Date (optional)</Label>
                  <Input
                    type="date"
                    id="edit-end-date"
                    value={editingSchedule.end_date || ""}
                    onChange={(e) => setEditingSchedule({...editingSchedule, end_date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-schedule-cost">Cost (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={editingSchedule.cost || 0}
                    onChange={(e) => setEditingSchedule({...editingSchedule, cost: parseFloat(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex border rounded-md">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm rounded-l-md ${
                        editingSchedule.is_active 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => setEditingSchedule({...editingSchedule, is_active: true})}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm rounded-r-md ${
                        !editingSchedule.is_active 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => setEditingSchedule({...editingSchedule, is_active: false})}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Updating..." : "Update Schedule"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setShowEditScheduleForm(false);
                    setEditingSchedule(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Toggleable View - Table, Calendar, or Patients */}
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
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Actions</th>
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
                            <span>Rp{(control.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className={getStatusColor(control.status)}>
                            {control.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              setEditingControl({...control});
                              setShowEditControlForm(true);
                            }}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'patients' ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPatientGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No members found. Add your first patient to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatientGroups.map((group) => {
                    // Get upcoming controls for this patient (controls in the future)
                    const upcomingControls = group.controls.filter(control => 
                      new Date(control.scheduled_date) >= new Date()
                    ).sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
                    
                    // Get recent past controls (controls in the past 30 days)
                    const pastDate = new Date();
                    pastDate.setDate(pastDate.getDate() - 30);
                    const recentControls = group.controls.filter(control => 
                      new Date(control.scheduled_date) >= pastDate && 
                      new Date(control.scheduled_date) < new Date()
                    ).sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());
                    
                    return (
                      <Card key={group.patient.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30">
                          <CardTitle className="text-lg">
                            {group.patient.first_name} {group.patient.last_name}
                          </CardTitle>
                          {group.patient.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {group.patient.phone}
                            </div>
                          )}
                          {group.patient.email && (
                            <div className="text-sm text-muted-foreground">
                              {group.patient.email}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {/* Upcoming Controls */}
                            <div>
                              <h4 className="font-medium text-sm mb-2">Upcoming Controls</h4>
                              {upcomingControls.length > 0 ? (
                                <div className="space-y-2">
                                  {upcomingControls.slice(0, 3).map(control => (
                                    <div key={control.id} className="flex justify-between items-center text-sm p-2 bg-muted/20 rounded">
                                      <div>
                                        <div className="font-medium">{control.control_type}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(control.scheduled_date).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(control.status)}>
                                          {control.status}
                                        </Badge>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            setEditingControl({...control});
                                            setShowEditControlForm(true);
                                          }}
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {upcomingControls.length > 3 && (
                                    <div className="text-xs text-muted-foreground text-center pt-1">
                                      +{upcomingControls.length - 3} more...
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground py-2 text-center">
                                  No upcoming controls
                                </div>
                              )}
                            </div>
                            
                            {/* Recurring Schedules */}
                            <div>
                              <h4 className="font-medium text-sm mb-2">Recurring Schedules</h4>
                              {group.schedules.length > 0 ? (
                                <div className="space-y-2">
                                  {group.schedules.map(schedule => (
                                    <div key={schedule.id} className="flex justify-between items-center text-sm p-2 bg-muted/20 rounded">
                                      <div>
                                        <div className="font-medium">{schedule.control_type}</div>
                                        <div className="text-xs text-muted-foreground capitalize">
                                          {schedule.frequency}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge className={schedule.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                          {schedule.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            setEditingSchedule({...schedule});
                                            setShowEditScheduleForm(true);
                                          }}
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground py-2 text-center">
                                  No recurring schedules
                                </div>
                              )}
                            </div>
                            
                            {/* Recent Controls */}
                            <div>
                              <h4 className="font-medium text-sm mb-2">Recent Controls</h4>
                              {recentControls.length > 0 ? (
                                <div className="space-y-2">
                                  {recentControls.slice(0, 2).map(control => (
                                    <div key={control.id} className="flex justify-between items-center text-sm p-2 bg-muted/20 rounded">
                                      <div>
                                        <div className="font-medium">{control.control_type}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(control.scheduled_date).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(control.status)}>
                                          {control.status}
                                        </Badge>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            setEditingControl({...control});
                                            setShowEditControlForm(true);
                                          }}
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground py-2 text-center">
                                  No recent controls
                                </div>
                              )}
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setNewControl({...newControl, patient_id: group.patient.id});
                                  setCreateNewPatientForControl(false); // Ensure we're not in new patient mode
                                  setShowAddForm(true);
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Add Control
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setNewSchedule({...newSchedule, patient_id: group.patient.id});
                                  setCreateNewPatientForSchedule(false); // Ensure we're not in new patient mode
                                  setShowAddScheduleForm(true);
                                }}
                              >
                                <List className="h-4 w-4 mr-1" />
                                Add Schedule
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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