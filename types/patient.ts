export interface Patient {
    id: string
    patientCode: string
    name: string
    department: string
    examDate: string
    orderNumber?: number
    examType?: string
  }
  
  export interface FilterCriteria {
    name: string
    department: string
    patientCode: string
    examDate: string
  }
  