"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth, firestore } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Cigarette, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const formSchema = z.object({
  cigQty: z.string().transform(Number),
  feeling: z.string().transform(Number),
});

type SmokingEvent = {
  date: Date;
  cigQty: number;
  feeling: number;
};

const feelingEmojis = ["😫 Un re bajón loco", "😔 Mal ahí no tenía que fumar y fallé", "😐 Maso", "🙂 Feliz", "😊 Terrible fumón"];

export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [smokingEvents, setSmokingEvents] = useState<SmokingEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCigsLastMonth: 0,
    averageFeeling: 0,
    totalCigsThisYear: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cigQty: 0,
      feeling: 0,
    },
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/signin");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchSmokingEvents = async () => {
      if (!auth.currentUser) return;

      setIsLoading(true);
      try {
        const q = query(
          collection(firestore, `users/${auth.currentUser.uid}/smokingEvents`),
          where("date", ">=", new Date(new Date().getFullYear(), 0, 1)),
          where("date", "<=", new Date(new Date().getFullYear(), 11, 31))
        );

        const querySnapshot = await getDocs(q);
        const events: SmokingEvent[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            date: data.date.toDate(),
            cigQty: data.cigQty,
            feeling: data.feeling,
          });
        });
        setSmokingEvents(events);
        calculateStats(events);
      } catch (error) {
        console.error("Error fetching smoking events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSmokingEvents();
  }, []);

  const calculateStats = (events: SmokingEvent[]) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const cigsLastMonth = events
      .filter(event => event.date >= lastMonth)
      .reduce((sum, event) => sum + event.cigQty, 0);

    const totalFeelings = events.reduce((sum, event) => sum + event.feeling, 0);
    const averageFeeling = events.length > 0 ? totalFeelings / events.length : 0;

    const cigsThisYear = events.reduce((sum, event) => sum + event.cigQty, 0);

    setStats({
      totalCigsLastMonth: cigsLastMonth,
      averageFeeling: Number(averageFeeling.toFixed(2)),
      totalCigsThisYear: cigsThisYear,
    });
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedDate || !auth.currentUser) return;

    setIsSaving(true);
    try {
      await addDoc(collection(firestore, `users/${auth.currentUser.uid}/smokingEvents`), {
        date: selectedDate,
        cigQty: values.cigQty,
        feeling: values.feeling,
      });

      const newEvents = [...smokingEvents, { date: selectedDate, cigQty: values.cigQty, feeling: values.feeling }];
      setSmokingEvents(newEvents);
      calculateStats(newEvents);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error al agregar evento de fumar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const modifiers = {
    smoking: smokingEvents.map((event) => event.date),
  };

  const modifiersStyles = {
    smoking: {
      color: "white",
      backgroundColor: "#ef4444",
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredEvents = smokingEvents.filter((event) => event.date.toDateString() === selectedDate.toDateString());
  const additionalEventsCount = filteredEvents.length - 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Cigarette className="w-6 h-6 text-blue-600" />
              DejarFácil
            </h1>
          </Link>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Cigarrillos Último Mes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg font-bold">{stats.totalCigsLastMonth}</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Sentimiento Promedio</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg font-bold">{feelingEmojis[Math.round(stats.averageFeeling) - 1]}</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Cigarrillos Este Año</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg font-bold">{stats.totalCigsThisYear}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setOpen(true);
                }}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
              />
            </div>
            <DialogContent className="sm:max-w-[425px] md:max-w-[800px] lg:max-w-[1000px]">
              {selectedDate && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Eventos del {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  {smokingEvents
                    .filter((event) => event.date.toDateString() === selectedDate.toDateString())
                    .slice(0, 2)
                    .map((event, index) => (
                      <Card key={index} className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 rounded-full p-2">
                              <Cigarette className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Cigarrillos</p>
                              <p className="text-2xl font-bold text-blue-600">{event.cigQty}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="font-medium text-gray-700">Sentimiento</p>
                            <span className="text-3xl" role="img" aria-label={`Sentimiento: ${feelingEmojis[event.feeling - 1]}`}>
                              {feelingEmojis[event.feeling - 1]}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }

                  {additionalEventsCount > 0 && (
                    <p className="text-gray-600 mt-2">
                      Y {additionalEventsCount} evento{additionalEventsCount > 1 ? 's' : ''} más
                    </p>
                  )}

                  {smokingEvents.filter((event) => event.date.toDateString() === selectedDate.toDateString()).length === 0 && (
                    <p className="text-gray-500 text-center">No hay eventos registrados para este día.</p>
                  )}
                </div>
              )}
              <DialogHeader>
                <DialogTitle>Agregar Evento de Fumado</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cigQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Cigarrillos</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="feeling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Cómo te sentiste?</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu sentimiento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {feelingEmojis.map((emoji, index) => (
                              <SelectItem key={index + 1} value={(index + 1).toString()}>
                                {emoji}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Evento'
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}