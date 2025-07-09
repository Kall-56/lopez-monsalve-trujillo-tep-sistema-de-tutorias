export class TutoringRequest {
    id: number;
    studentId: number;
    tutorId: number;
    subjectId: number;
    desiredDate: Date;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: Date;
}