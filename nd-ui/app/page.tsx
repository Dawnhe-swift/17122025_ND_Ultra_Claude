"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  apiClient,
  type CreateCompanyPayload,
  type CreateDirectorPayload,
  type CreateObligationPayload,
  type Obligation,
} from "@/lib/api-client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const companySchema = z.object({
  name: z.string().min(2),
  uen: z.string().min(3),
  sector: z.string().optional(),
  nomineeDirectorId: z.string().uuid().optional(),
});

const directorSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const obligationSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().optional(),
  dueDate: z.string().min(1),
  companyId: z.string().uuid(),
  directorId: z.string().uuid().optional(),
});

const statusVariantMap: Record<Obligation["status"], "default" | "secondary" | "destructive" | "outline"> =
  {
    pending: "outline",
    in_progress: "secondary",
    completed: "default",
    overdue: "destructive",
  };

export default function Home() {
  const queryClient = useQueryClient();
  const { token, user, isAuthenticated, login, logout } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", uen: "", sector: "", nomineeDirectorId: undefined },
  });

  const directorForm = useForm<z.infer<typeof directorSchema>>({
    resolver: zodResolver(directorSchema),
    defaultValues: { fullName: "", email: "", phone: "" },
  });

  const obligationForm = useForm<z.infer<typeof obligationSchema>>({
    resolver: zodResolver(obligationSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      dueDate: "",
      companyId: "",
      directorId: undefined,
    },
  });

  const loginMutation = useMutation({
    mutationFn: apiClient.login,
    onSuccess: (data) => {
      login(data);
      loginForm.reset();
      registerForm.reset();
    },
    onError: (error: Error) => {
      loginForm.setError("root", { message: error.message });
    },
  });

  const registerMutation = useMutation({
    mutationFn: apiClient.register,
    onSuccess: (data) => {
      login(data);
    },
    onError: (error: Error) => {
      registerForm.setError("root", { message: error.message });
    },
  });

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: () => apiClient.getCompanies(token ?? ""),
    enabled: isAuthenticated,
  });

  const directorsQuery = useQuery({
    queryKey: ["directors"],
    queryFn: () => apiClient.getDirectors(token ?? ""),
    enabled: isAuthenticated,
  });

  const obligationsQuery = useQuery({
    queryKey: ["obligations"],
    queryFn: () => apiClient.getObligations(token ?? ""),
    enabled: isAuthenticated,
  });

  const createCompanyMutation = useMutation({
    mutationFn: (payload: CreateCompanyPayload) =>
      apiClient.createCompany(token ?? "", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      companyForm.reset();
    },
  });

  const createDirectorMutation = useMutation({
    mutationFn: (payload: CreateDirectorPayload) =>
      apiClient.createDirector(token ?? "", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directors"] });
      directorForm.reset();
    },
  });

  const createObligationMutation = useMutation({
    mutationFn: (payload: CreateObligationPayload) =>
      apiClient.createObligation(token ?? "", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obligations"] });
      obligationForm.reset();
    },
  });

  const companies = companiesQuery.data ?? [];
  const directors = directorsQuery.data ?? [];
  const obligations = obligationsQuery.data ?? [];

  const counts = useMemo(
    () => ({
      totalObligations: obligations.length,
      pending: obligations.filter((o) => o.status === "pending").length,
      overdue: obligations.filter((o) => o.status === "overdue").length,
      completed: obligations.filter((o) => o.status === "completed").length,
      companies: companies.length,
    }),
    [obligations, companies],
  );

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-4 py-12">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Nominee Director Obligation Tracker
          </p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-muted-foreground">
            Use your email and password to access the dashboard. First-time users can register a new account.
          </p>
        </div>

        <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Access your existing account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="space-y-3"
                onSubmit={loginForm.handleSubmit((values) =>
                  loginMutation.mutate(values),
                )}
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    {...loginForm.register("email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="********"
                    {...loginForm.register("password")}
                  />
                </div>
                {loginForm.formState.errors.root?.message && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create the first admin account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="space-y-3"
                onSubmit={registerForm.handleSubmit((values) =>
                  registerMutation.mutate(values),
                )}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    {...registerForm.register("name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@company.com"
                    {...registerForm.register("email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="********"
                    {...registerForm.register("password")}
                  />
                </div>
                {registerForm.formState.errors.root?.message && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  variant="secondary"
                >
                  {registerMutation.isPending ? "Creating account..." : "Register & Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Nominee Director Dashboard
          </p>
          <h1 className="text-3xl font-semibold">Obligation Tracking</h1>
          <p className="text-muted-foreground">
            Monitor corporate filings, due dates, and director assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Obligations" value={counts.totalObligations} />
        <SummaryCard title="Pending" value={counts.pending} />
        <SummaryCard title="Overdue" value={counts.overdue} />
        <SummaryCard title="Companies" value={counts.companies} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Open Obligations</CardTitle>
            <CardDescription>Upcoming and overdue deliverables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {obligationsQuery.isLoading && (
              <p className="text-sm text-muted-foreground">Loading obligations…</p>
            )}
            {!obligationsQuery.isLoading && obligations.length === 0 && (
              <p className="text-sm text-muted-foreground">No obligations created yet.</p>
            )}
            <div className="space-y-2">
              {obligations.map((obligation) => (
                <div
                  key={obligation.id}
                  className="rounded-lg border p-3 hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{obligation.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {obligation.company.name} · Due{" "}
                        {new Date(obligation.dueDate).toLocaleDateString("en-SG")}
                      </p>
                      {obligation.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {obligation.description}
                        </p>
                      )}
                    </div>
                    <Badge variant={statusVariantMap[obligation.status]}>
                      {obligation.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {obligation.category && (
                      <span className="rounded bg-muted px-2 py-1">
                        {obligation.category}
                      </span>
                    )}
                    {obligation.director && (
                      <span className="rounded bg-muted px-2 py-1">
                        Assigned: {obligation.director.fullName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add Obligation</CardTitle>
              <CardDescription>Create a new compliance item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form
                className="space-y-3"
                onSubmit={obligationForm.handleSubmit((values) =>
                  createObligationMutation.mutate(values),
                )}
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...obligationForm.register("title")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={2}
                    {...obligationForm.register("description")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...obligationForm.register("category")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due date</Label>
                    <Input id="dueDate" type="date" {...obligationForm.register("dueDate")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select id="company" {...obligationForm.register("companyId")}>
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="director">Nominee Director (optional)</Label>
                  <Select id="director" {...obligationForm.register("directorId")}>
                    <option value="">Unassigned</option>
                    {directors.map((director) => (
                      <option key={director.id} value={director.id}>
                        {director.fullName}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createObligationMutation.isPending}
                >
                  {createObligationMutation.isPending ? "Saving..." : "Add obligation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Add a client entity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form
                className="space-y-3"
                onSubmit={companyForm.handleSubmit((values) =>
                  createCompanyMutation.mutate({
                    ...values,
                    nomineeDirectorId: values.nomineeDirectorId || undefined,
                  }),
                )}
              >
                <div className="space-y-2">
                  <Label htmlFor="company-name">Name</Label>
                  <Input id="company-name" {...companyForm.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-uen">UEN</Label>
                  <Input id="company-uen" {...companyForm.register("uen")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-sector">Sector</Label>
                  <Input id="company-sector" {...companyForm.register("sector")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nominee">Nominee Director</Label>
                  <Select
                    id="nominee"
                    {...companyForm.register("nomineeDirectorId")}
                  >
                    <option value="">Unassigned</option>
                    {directors.map((director) => (
                      <option key={director.id} value={director.id}>
                        {director.fullName}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  variant="outline"
                  disabled={createCompanyMutation.isPending}
                >
                  {createCompanyMutation.isPending ? "Creating..." : "Add company"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nominee Directors</CardTitle>
              <CardDescription>Track directors and contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form
                className="space-y-3"
                onSubmit={directorForm.handleSubmit((values) =>
                  createDirectorMutation.mutate(values),
                )}
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" {...directorForm.register("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="director-email">Email</Label>
                  <Input
                    id="director-email"
                    type="email"
                    {...directorForm.register("email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="director-phone">Phone</Label>
                  <Input id="director-phone" {...directorForm.register("phone")} />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  variant="secondary"
                  disabled={createDirectorMutation.isPending}
                >
                  {createDirectorMutation.isPending ? "Adding..." : "Add director"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
