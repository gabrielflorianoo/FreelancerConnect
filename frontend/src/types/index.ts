export interface User {
    id: string;
    email: string;
    name: string;
    role: "CLIENT" | "FREELANCER" | "ADMIN";
    location?: string;
    bio?: string;
    phone?: string;
    services?: string[];
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
    balance: number;
}

export interface ClientProfile extends User {
    role: "CLIENT";
}

export interface FreelancerProfile extends User {
    role: "FREELANCER";
    services: string[];
    hourlyRate?: number;
    skills?: string[];
    availability?: string;
    experience?: string;
    website?: string;
    bio: string;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number | string;
    status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
    skills: string[];
    experience?: string;
    deadline?: string;
    clientId: string;
    freelancerId?: string;
    createdAt: string;
    updatedAt: string;
    location: string;
    client?: ClientProfile;
    freelancer?: FreelancerProfile;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    jobId: string;
    createdAt: string;
    sender?: User;
    job?: Job;
}

export interface Review {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    jobId: string;
    freelancerId: string;
    freelancer?: FreelancerProfile;
    job?: Job;
}

export interface Payment {
    id: string;
    jobId: string;
    amount: number;
    status: string;
    method: string;
    createdAt: string;
    job?: Job;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: "CLIENT" | "FREELANCER";
    location?: string;
    phone?: string;
}
