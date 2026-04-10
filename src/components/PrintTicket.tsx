import React from 'react';

interface PrintTicketProps {
  studentName: string;
  className: string;
  time: string;
  date: string;
  reason: string;
}

export const PrintTicket: React.FC<PrintTicketProps> = ({ studentName, className, time, date, reason }) => {
  return (
    <div id="printable-ticket" className="hidden print:block">
      <div className="text-center mb-4">
        <h1 className="font-bold text-lg">QENDRA DON BOSKO</h1>
        <p className="text-xs border-b border-black pb-2">Biletë Vonese — Dorëzohet Nxënësit</p>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p><strong>Data:</strong> {date}</p>
        <p><strong>Ora e hyrjes:</strong> {time}</p>
        <p><strong>Nxënësi:</strong> {studentName}</p>
        <p><strong>Klasa:</strong> {className}</p>
        <p><strong>Arsyeja:</strong> {reason}</p>
      </div>

      <div className="mt-6 text-xs border-t border-black pt-3">
        <p className="mb-4">Firma e Sekretarisë: _________________</p>
        <p className="text-center text-xs mt-4 border-t border-dashed border-black pt-2 opacity-60">
          Kjo biletë i dorëzohet nxënësit dhe paraqitet tek mësuesi.
        </p>
      </div>
    </div>
  );
};
