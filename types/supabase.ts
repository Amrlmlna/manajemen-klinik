export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          clinic_name: string | null
          created_at: string
          updated_at: string
        }
      }
      patients: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          medical_history: string | null
          created_at: string
          updated_at: string
        }
      }
      controls: {
        Row: {
          id: string
          patient_id: string
          control_type: string
          scheduled_date: string
          status: string
          notes: string | null
          cost: number | null
          created_at: string
          updated_at: string
        }
      }
      control_schedules: {
        Row: {
          id: string
          patient_id: string
          control_type: string
          frequency: string
          start_date: string
          end_date: string | null
          is_active: boolean
          cost: number | null
          created_at: string
          updated_at: string
        }
      }
      costs: {
        Row: {
          id: string
          control_id: string | null
          amount: number
          cost_type: string
          description: string | null
          cost_date: string
          created_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          patient_id: string | null
          control_id: string | null
          notification_type: string
          message: string
          is_read: boolean
          created_at: string
        }
      }
    }
  }
}
