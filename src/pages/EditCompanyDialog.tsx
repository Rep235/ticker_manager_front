import { useState } from 'react';
import type { Company } from '../features/companies/services/companyService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Company>) => Promise<void>;
}

export const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({ company, open, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<Company>>({ ...company, responsables: undefined });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResponsibleUserIdsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    (form as any).responsibleUserIds = e.target.value.split(',').map((id: string) => id.trim()).filter(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Error al modificar compañía');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Modificar Compañía</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" label="Nombre" value={form.name || ''} onChange={handleInput} required />
          <Input name="rut" label="RUT" value={form.rut || ''} onChange={handleInput} required />
          <Input name="email" label="Email" value={form.email || ''} onChange={handleInput} />
          <Input name="phone" label="Teléfono" value={form.phone || ''} onChange={handleInput} />
          <Input name="address" label="Dirección" value={form.address || ''} onChange={handleInput} />
          <Input name="description" label="Descripción" value={form.description || ''} onChange={handleInput} />
          <Input name="responsibleUserIds" label="ID de Responsables (separados por coma)" value={Array.isArray((form as any).responsibleUserIds) ? (form as any).responsibleUserIds.join(', ') : ''} onChange={handleResponsibleUserIdsInput} placeholder="uuid-1, uuid-2" />
          {formError && <Alert type="error" message={formError} />}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" isLoading={submitting}>Guardar cambios</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
