// types/global.d.ts



declare global {
     interface ServiceLog {
        _id?: string;
        canId: string;
        userId: string;
        weekOf: Date | string; // Accept either, convert before sending
        status: string
        servicedAt: Date
        servicedDate: string
        illegalDumping: boolean;
        notes?: string;
    }
    interface PinLocation {
         latitude: number;
         longitude: number;
         latitudeDelta: number,
         longitudeDelta: number,
   }
}

export {}
