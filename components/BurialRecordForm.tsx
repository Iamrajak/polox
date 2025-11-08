"use client";

import { useState } from 'react';
import { useBurialRecord } from '@/contexts/BurialRecordContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface BurialRecordFormProps {
  onClose: () => void;
}

export default function BurialRecordForm({ onClose }: BurialRecordFormProps) {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [religion, setReligion] = useState('');
  const [plotId, setPlotId] = useState('');
  const [graveId, setGraveId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { addRecord } = useBurialRecord();
  const { plots, graves } = useGraveyard();

  const availablePlots = plots.filter((p) => p.totalGraves > 0);
  const selectedPlot = plots.find((p) => p.id === plotId);
  const availableGraves = selectedPlot
    ? graves.filter((g) => g.plotId === plotId && g.status === 'available')
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !fatherName || !dateOfDeath || !age || !religion || !plotId || !graveId) {
      setError('All fields are required');
      return;
    }

    if (parseInt(age) < 0 || parseInt(age) > 150) {
      setError('Age must be between 0 and 150');
      return;
    }

    setIsLoading(true);

    try {
      addRecord({
        name,
        fatherName,
        dateOfDeath,
        gender,
        age: parseInt(age),
        religion,
        plotId,
        graveId,
        status: 'pending',
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900">New Burial Record</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name</label>
              <Input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Father's name"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Death</label>
              <Input
                type="date"
                value={dateOfDeath}
                onChange={(e) => setDateOfDeath(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <Select value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age at death"
                required
                min="0"
                max="150"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Religion</label>
              <Select value={religion} onValueChange={setReligion}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Christianity">Christianity</SelectItem>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Judaism">Judaism</SelectItem>
                  <SelectItem value="Hinduism">Hinduism</SelectItem>
                  <SelectItem value="Buddhism">Buddhism</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plot</label>
              <Select value={plotId} onValueChange={setPlotId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select plot" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      Plot {plot.plotNumber} - {plot.totalGraves} graves
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Grave</label>
              <Select value={graveId} onValueChange={setGraveId} disabled={!plotId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={plotId ? "Select grave" : "Select plot first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableGraves.map((grave) => (
                    <SelectItem key={grave.id} value={grave.id}>
                      Grave {grave.graveNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-cyan-700"
            >
              {isLoading ? 'Creating...' : 'Create Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
