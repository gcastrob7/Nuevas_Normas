import React from 'react';

export enum Category {
  ADUANERA = 'Aduanera',
  CAMBIARIA = 'Cambiaria',
  TRIBUTARIA = 'Tributaria',
  COMERCIO_EXTERIOR = 'Comercio Exterior'
}

export interface Norm {
  id: string;
  title: string;
  type: 'Decreto' | 'Resolución' | 'Circular' | 'Ley' | 'Concepto';
  number: string;
  date: string;
  category: Category;
  summary: string; // Resumen ejecutivo
  fullText: string;
  issuingAuthority: string; // e.g., DIAN, MinCIT, BanRep
  isNew?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  colorClass: string;
};