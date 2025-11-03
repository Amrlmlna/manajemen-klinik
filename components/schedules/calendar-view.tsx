"use client";

import { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer, EventProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  List,
  Grid,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const localizer = momentLocalizer(moment);

// Define the custom event component
const CustomEvent = ({ event }: any) => {
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
    <div className={`p-2 rounded border ${getStatusColor(event.status)}`}>
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs flex items-center mt-1">
        <Clock className="h-3 w-3 mr-1" />
        {moment(event.start).format("HH:mm")}
      </div>
      <div className="text-xs flex items-center">
        <Badge variant="secondary" className="text-[10px]">
          {event.control_type}
        </Badge>
      </div>
    </div>
  );
};

interface CalendarViewProps {
  events: any[];
  profile: any;
}

export function CalendarView({ events, profile }: CalendarViewProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentEvents, setCurrentEvents] = useState(events);

  // Filter events based on status
  const filteredEvents = filterStatus === 'all' 
    ? currentEvents 
    : currentEvents.filter(event => event.status === filterStatus);

  // Handle event move (drag-and-drop)
  const handleEventMove = async (event: any, start: Date, end: Date) => {
    // Update the event in the state
    const updatedEvents = currentEvents.map(e => 
      e.id === event.id 
        ? { ...e, start, end } 
        : e
    );
    setCurrentEvents(updatedEvents);

    // Save the changes to the database
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('controls')
        .update({ scheduled_date: start.toISOString() })
        .eq('id', event.id);

      if (error) {
        console.error('Error updating control:', error);
        // Revert the change in the UI if the update failed
        setCurrentEvents(events); // Reset to original events from props
      } else {
        // Optionally show success feedback
        console.log('Control rescheduled successfully');
      }
    } catch (error) {
      console.error('Error rescheduling control:', error);
      // Revert the change in the UI if the update failed
      setCurrentEvents(events); // Reset to original events from props
    }
  };

  // Custom toolbar component to replace default
  const Toolbar = (toolbar: any) => {
    const goToDay = () => {
      toolbar.onNavigate('TODAY');
      setDate(new Date());
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
          <h2 className="text-xl font-bold mx-4">
            {moment(toolbar.date).format("MMMM YYYY")}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
              className="rounded-none border-l-0 border-r-0"
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('day')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Custom event wrapper to add tooltips
  const EventWrapper = ({ event, children }: any) => {
    return (
      <div 
        className="h-full w-full"
        title={`${event.title}\nStatus: ${event.status}\nTime: ${moment(event.start).format('HH:mm')}\nType: ${event.control_type}`}
      >
        {children}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Control Calendar
        </CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Control
        </Button>
      </CardHeader>
      <CardContent>
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          view={view}
          date={date}
          onNavigate={setDate}
          style={{ height: 600 }}
          components={{
            toolbar: Toolbar,
            event: CustomEvent,
            eventWrapper: EventWrapper
          }}
          eventPropGetter={(event) => ({
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
          onEventDrop={handleEventMove} // Enable drag-and-drop rescheduling
          selectable
          resizable
          onEventResize={handleEventMove as any} // Enable resizing events
          step={15} // 15-minute intervals
          timeslots={4} // 4 slots per hour (every 15 minutes)
          defaultDate={new Date()}
          scrollToTime={new Date(0)}
          dragRevertDuration={100}
        />
      </CardContent>
    </Card>
  );
}