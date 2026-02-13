
import React from 'react';
import { Database, ShieldCheck, HardDrive, Layout, StickyNote, Wallet, ShoppingCart, Users } from 'lucide-react';
import { Template } from './types';

export const APP_NAME = "SQL Architect Pro";

export const TEMPLATES: Template[] = [
  {
    id: 'notes-budgeting',
    title: 'Notes & Budgeting',
    description: 'Personal finance app with journals and media storage.',
    prompt: `Create a "Notes & Budgeting" app. 
- Tables: profiles (id, email), notes (id, user_id, title, content, media_url, created_at), budget (id, user_id, type, amount, category, created_at). 
- RLS: Enable for all. Users only access their own data.
- Storage: Bucket 'journal_files' for authenticated users.`
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    description: 'Product catalog, orders, and customer profiles.',
    prompt: `E-commerce system. 
- Tables: products, orders, order_items, customers.
- Security: Public view for products, private orders.
- Storage: 'product_images' bucket.`
  },
  {
    id: 'saas-core',
    title: 'SaaS Boilerplate',
    description: 'Organizations, team members, and subscription status.',
    prompt: `SaaS structure with multi-tenancy.
- Tables: organizations, profiles, team_members (linking profiles to orgs).
- Security: Organization-level RLS.`
  }
];

export const ICONS = {
  Database: <Database size={18} />,
  Shield: <ShieldCheck size={18} />,
  Storage: <HardDrive size={18} />,
  Layout: <Layout size={18} />,
  Notes: <StickyNote size={18} />,
  Wallet: <Wallet size={18} />,
  Shop: <ShoppingCart size={18} />,
  Users: <Users size={18} />
};
