"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { specialties } from "@/constants";
import { Input } from "@/components/ui/input";

const locations = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre"]; // Add more as needed
const availabilities = ["Manhã", "Tarde", "Noite"];

export default function DoctorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [availability, setAvailability] = useState(
    searchParams.get("availability") || ""
  );
  const [name, setName] = useState(searchParams.get("name") || ""); // Novo estado para nome

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (specialty) params.set("specialty", specialty);
    else params.delete("specialty");
    if (location) params.set("location", location);
    else params.delete("location");
    if (availability) params.set("availability", availability);
    else params.delete("availability");
    if (name) params.set("name", name);
    else params.delete("name");

    router.push(`/profissionais?${params.toString()}`);
  }, [specialty, location, availability, name, router, searchParams]);

  const clearFilters = () => {
    setSpecialty("");
    setLocation("");
    setAvailability("");
    setName("");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Input
        type="text"
        placeholder="Pesquisar por nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2"
      />

      <Select value={specialty} onValueChange={setSpecialty}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Especialidade" />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Localização" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={availability} onValueChange={setAvailability}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Disponibilidade" />
        </SelectTrigger>
        <SelectContent>
          {availabilities.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(specialty || location || availability || name) && (
        <Button variant="destructive" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
