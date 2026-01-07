import React from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { ListChecks, ShieldCheck, Users2, MessageSquare } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Control de acceso seguro',
      description: 'Roles de administrador, agente y cliente para operar con permisos claros.',
    },
    {
      icon: ListChecks,
      title: 'Gestión completa de tickets',
      description: 'Crea, asigna y resuelve tickets con prioridades, estados y vencimientos.',
    },
    {
      icon: Users2,
      title: 'Usuarios y clientes',
      description: 'Administra usuarios internos y clientes con visibilidad centralizada.',
    },
    {
      icon: MessageSquare,
      title: 'Comentarios y seguimiento',
      description: 'Documenta cada ticket con comentarios internos o visibles para el cliente.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Guía rápida del sistema</h1>
        <p className="text-sm text-[var(--muted)]">
          Como administrador puedes configurar el equipo, clientes y flujos de tickets desde un solo lugar.
        </p>
      </div>

      <Card>
        <CardHeader
          title="¿Qué puedes hacer como administrador?"
          description="Configura la cuenta, equipos y procesos de soporte en minutos."
        />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                <Icon size={18} />
                <span>{title}</span>
              </div>
              <p className="text-sm text-[var(--muted)]">{description}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Pasos recomendados al iniciar"
          description="Sigue este orden para poner en marcha tu mesa de ayuda."
        />
        <CardBody className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-[var(--text)]">
            <li>Invita a tus agentes desde la sección Usuarios.</li>
            <li>Registra tus clientes principales en la sección Clientes.</li>
            <li>Crea colas o categorías usando etiquetas en los tickets.</li>
            <li>Configura tu logo y tema visual en Preferencias.</li>
            <li>Abre un ticket de prueba para validar el flujo de comentarios y estados.</li>
          </ol>
        </CardBody>
      </Card>
    </div>
  );
};

export default AboutPage;
