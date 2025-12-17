const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type FetchInit = RequestInit & { token?: string };

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer";
};

export type Director = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
};

export type Company = {
  id: string;
  name: string;
  uen: string;
  sector?: string;
  nomineeDirector?: Director | null;
};

export type ObligationStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "overdue";

export type Obligation = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  dueDate: string;
  status: ObligationStatus;
  company: Company;
  director?: Director | null;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  role?: AuthUser["role"];
};
export type CreateCompanyPayload = {
  name: string;
  uen: string;
  sector?: string;
  nomineeDirectorId?: string;
};
export type CreateDirectorPayload = {
  fullName: string;
  email?: string;
  phone?: string;
};
export type CreateObligationPayload = {
  title: string;
  description?: string;
  category?: string;
  dueDate: string;
  companyId: string;
  directorId?: string;
  status?: ObligationStatus;
};
export type UpdateObligationPayload = Partial<
  Omit<CreateObligationPayload, "companyId"> & { companyId?: string }
> & { status?: ObligationStatus };

async function apiRequest<T>(path: string, init: FetchInit = {}): Promise<T> {
  const { token, ...options } = init;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const message =
      (payload as { message?: string })?.message ?? "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export const apiClient = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getCompanies: (token: string) =>
    apiRequest<Company[]>("/companies", { token }),
  createCompany: (token: string, payload: CreateCompanyPayload) =>
    apiRequest<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
  getDirectors: (token: string) =>
    apiRequest<Director[]>("/directors", { token }),
  createDirector: (token: string, payload: CreateDirectorPayload) =>
    apiRequest<Director>("/directors", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
  getObligations: (token: string) =>
    apiRequest<Obligation[]>("/obligations", { token }),
  createObligation: (token: string, payload: CreateObligationPayload) =>
    apiRequest<Obligation>("/obligations", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
  updateObligation: (
    token: string,
    id: string,
    payload: UpdateObligationPayload,
  ) =>
    apiRequest<Obligation>(`/obligations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    }),
};

