import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Upload,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Phone,
  Mail,
  FileText,
  UserCheck,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { Learner, ClassGroup, LanguageCode, ConsentStatus } from '../../types';
import { OFFICIAL_LANGUAGES } from '../../data/initialData';
import { useToast } from '../../context/ToastContext';

interface MyClassesViewProps {
  classes: ClassGroup[];
  learners: Learner[];
  onAddLearner: (learner: Learner) => void;
  onUpdateLearner: (learner: Learner) => void;
  onDeleteLearner: (learnerId: string) => void;
  onBatchImportLearners: (newLearners: Learner[]) => void;\n  onAddClass: (classGroup: ClassGroup) => void;
}

export const MyClassesView: React.FC<MyClassesViewProps> = ({
  classes,
  learners,
  onAddLearner,
  onUpdateLearner,
  onDeleteLearner,
  onBatchImportLearners,
}) => {
  const { showToast } = useToast();

  const [selectedClassTab, setSelectedClassTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [editingLearner, setEditingLearner] = useState<Learner | null>(null);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);\n  const [showClassModal, setShowClassModal] = useState<boolean>(false);\n  const [classForm, setClassForm] = useState({ grade: '9', section: '', subject: '', room: '', periodSchedule: '' });

  // CSV State
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<Array<{ learner: Partial<Learner>; isValid: boolean; errors: string[] }>>([]);
  const [csvStep, setCsvStep] = useState<'input' | 'preview'>('input');

  // Form State for Add / Edit Learner
  const [formData, setFormData] = useState<Partial<Learner>>({
    learnerNumber: '',
    firstName: '',
    lastName: '',
    gender: 'Female',
    grade: '9',
    classSection: classes[0]?.section || '',
    dateOfBirth: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelationship: 'Mother',
    homeLanguage: 'zu',
    specialNeedsNotes: '',
    academicNotes: '',
    consentStatus: 'pending',
  });

  const handleOpenClassModal = () => {
    setClassForm({ grade: '9', section: '', subject: '', room: '', periodSchedule: '' });
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const grade = classForm.grade.trim();
    const section = classForm.section.trim().toUpperCase().replace(/\s+/g, '');
    const subject = classForm.subject.trim();

    if (!subject || !/^(8|9|10|11|12)[A-Z0-9]+$/.test(section) || !section.startsWith(grade)) {
      showToast('error', 'Check Class Details', 'Enter a class code such as 9A that matches the selected grade, and add a subject.');
      return;
    }

    if (classes.some((cls) => cls.section.toUpperCase() === section)) {
      showToast('error', 'Class Already Exists', 'A class with this code already exists.');
      return;
    }

    const newClass: ClassGroup = {
      id: 'class-' + Date.now(),
      grade,
      section,
      name: 'Grade ' + section,
      subject,
      room: classForm.room.trim(),
      learnerCount: 0,
      periodSchedule: classForm.periodSchedule.trim(),
    };

    onAddClass(newClass);
    setSelectedClassTab(section);
    setShowClassModal(false);
    showToast('success', 'Class Created', newClass.name + ' is ready for learner records.');
  };

  const handleOpenAdd = () => {
    setEditingLearner(null);
    setFormData({
      learnerNumber: '',
      firstName: '',
      lastName: '',
      gender: 'Female',
      grade: selectedClassTab === 'All' ? '9' : selectedClassTab.replace(/[^\d]/g, ''),
      classSection: (classes.find((cls) => cls.section === selectedClassTab) || classes[0])?.section || '',
      dateOfBirth: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      guardianRelationship: 'Mother',
      homeLanguage: 'zu',
      specialNeedsNotes: '',
      academicNotes: '',
      consentStatus: 'pending',
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (learner: Learner) => {
    setEditingLearner(learner);
    setFormData({ ...learner });
    setShowAddEditModal(true);
  };

  const handleSaveLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.guardianName) {
      showToast('error', 'Validation Error', 'First name, last name, and guardian name are required.');
      return;
    }

    if (!classes.some((cls) => cls.section === formData.classSection)) {\n      showToast('error', 'Class Required', 'Create or select a class before registering a learner.');\n      return;\n    }\n\n    if (editingLearner) {
      const updated: Learner = {
        ...editingLearner,
        ...(formData as Learner),
      };
      onUpdateLearner(updated);
      showToast('success', 'Learner Profile Updated', `${updated.firstName} ${updated.lastName} saved.`);
    } else {
      const created: Learner = {
        id: `lrn-${Date.now()}`,
        learnerNumber: formData.learnerNumber || `L-${Date.now()}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        gender: formData.gender || 'Female',
        grade: formData.grade || '9',
        classSection: formData.classSection || '9A',
        dateOfBirth: formData.dateOfBirth || '',
        guardianName: formData.guardianName!,
        guardianPhone: formData.guardianPhone || '',
        guardianEmail: formData.guardianEmail || '',
        guardianRelationship: formData.guardianRelationship || 'Mother',
        homeLanguage: formData.homeLanguage || 'zu',
        specialNeedsNotes: formData.specialNeedsNotes,
        academicNotes: formData.academicNotes,
        consentStatus: formData.consentStatus || 'pending',
      };
      onAddLearner(created);
      showToast('success', 'Learner Added', `${created.firstName} ${created.lastName} registered in ${created.classSection}.`);
    }

    setShowAddEditModal(false);
  };

  const handleDelete = (learner: Learner) => {
    if (confirm(`Remove ${learner.firstName} ${learner.lastName} (${learner.learnerNumber}) from class records?`)) {
      onDeleteLearner(learner.id);
      showToast('info', 'Learner Removed', `${learner.firstName} ${learner.lastName} removed.`);
    }
  };

  // CSV Parsing & Validation
  const sampleCsvData = 'LearnerNumber,FirstName,LastName,Gender,Grade,Class,GuardianName,Relationship,Phone,Email,Language';

  const handleLoadSampleCsv = () => {
    setCsvRawText(sampleCsvData);\n    showToast('info', 'CSV Header Loaded', 'Add your own rows. No sample learner records are included.');\n    showToast('info', 'CSV Header Loaded', 'Add your own rows. No sample learner records are included.');
  };

  const handleParseCsv = () => {
    if (!csvRawText.trim()) {
      showToast('warning', 'Empty CSV', 'Please enter or paste CSV records.');
      return;
    }

    const lines = csvRawText.trim().split('\n');
    if (lines.length < 2) {
      showToast('error', 'Invalid CSV Format', 'CSV must contain at least a header and 1 data row.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const errors: string[] = [];

      // Minimal index lookup
      const numIdx = headers.indexOf('learnernumber');
      const fnIdx = headers.indexOf('firstname');
      const lnIdx = headers.indexOf('lastname');
      const genIdx = headers.indexOf('gender');
      const grIdx = headers.indexOf('grade');
      const clIdx = headers.indexOf('class');
      const gnIdx = headers.indexOf('guardianname');
      const relIdx = headers.indexOf('relationship');
      const phIdx = headers.indexOf('phone');
      const emIdx = headers.indexOf('email');
      const lgIdx = headers.indexOf('language');

      const firstName = values[fnIdx >= 0 ? fnIdx : 1] || '';
      const lastName = values[lnIdx >= 0 ? lnIdx : 2] || '';
      const phone = values[phIdx >= 0 ? phIdx : 8] || '';

      if (!firstName) errors.push('Missing first name');
      if (!lastName) errors.push('Missing last name');
      if (!phone || phone.length < 9) errors.push('Invalid phone format');\n      if (!(values[numIdx >= 0 ? numIdx : 0] || '').trim()) errors.push('Missing learner number');\n      if (!(values[gnIdx >= 0 ? gnIdx : 6] || '').trim()) errors.push('Missing guardian name');\n      const classCode = values[clIdx >= 0 ? clIdx : 5] || '';\n      if (!classes.some((cls) => cls.section === classCode)) errors.push('Unknown class section');

      const learner: Partial<Learner> = {
        id: `lrn-csv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        learnerNumber: values[numIdx >= 0 ? numIdx : 0] || '',
        firstName,
        lastName,
        gender: (values[genIdx >= 0 ? genIdx : 3] as any) || 'Female',
        grade: values[grIdx >= 0 ? grIdx : 4] || '',
        classSection: values[clIdx >= 0 ? clIdx : 5] || '',
        dateOfBirth: '',
        guardianName: values[gnIdx >= 0 ? gnIdx : 6] || '',
        guardianRelationship: (values[relIdx >= 0 ? relIdx : 7] as any) || 'Mother',
        guardianPhone: phone,
        guardianEmail: values[emIdx >= 0 ? emIdx : 9] || '',
        homeLanguage: (values[lgIdx >= 0 ? lgIdx : 10] as LanguageCode) || 'zu',
        consentStatus: 'pending',
      };

      return {
        learner,
        isValid: errors.length === 0,
        errors,
      };
    });

    setParsedRows(rows);
    setCsvStep('preview');
  };

  const handleConfirmCsvImport = () => {
    const validLearners = parsedRows
      .filter((r) => r.isValid)
      .map((r) => r.learner as Learner);

    if (validLearners.length === 0) {
      showToast('error', 'Cannot Import', 'No valid rows found to import.');
      return;
    }

    onBatchImportLearners(validLearners);
    setShowCsvModal(false);
    setCsvStep('input');
    setCsvRawText('');
    setParsedRows([]);
    showToast('success', 'Batch Import Completed', `Successfully imported ${validLearners.length} learner records.`);
  };

  // Filter learners
  const filteredLearners = learners.filter((l) => {
    const matchesClass = selectedClassTab === 'All' || l.classSection === selectedClassTab;
    const matchesSearch =
      l.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.learnerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#171936] tracking-tight">
            My Classes & Learners
          </h2>
          <p className="text-xs text-gray-500">
            Class cohorts, guardian contacts & local CSV batch upload (No gradebook / attendance)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCsvStep('input');
              setShowCsvModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#171936] text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-bold hover:bg-[#4337b0] transition-colors shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Learner</span>
          </button>
        </div>
      </div>

      {/* Class Cohorts KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {classes.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#C9C5F0] bg-white p-6 text-center">
            <h3 className="text-sm font-bold text-[#171936]">No classes created yet</h3>
            <p className="text-xs text-gray-500 mt-1">Create a class first, then add learners or import a roster.</p>
            <button type="button" onClick={handleOpenClassModal} className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-bold">
              <Plus className="w-4 h-4" /> Create First Class
            </button>
          </div>
        ) : classes.map((cls) => {
          const count = learners.filter((l) => l.classSection === cls.section).length;
          const isSelected = selectedClassTab === cls.section;
          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassTab(cls.section)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#F0EEFF] border-[#5145C5] shadow-xs ring-1 ring-[#5145C5]/20'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5145C5]">{cls.name}</span>
                <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded">
                  Gr {cls.grade}
                </span>
              </div>
              <div className="text-xl font-bold text-[#171936] mt-2">{count} Learners</div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate">{cls.subject}</div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedClassTab('All')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
              selectedClassTab === 'All'
                ? 'bg-[#171936] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Classes ({learners.length})
          </button>
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClassTab(c.section)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
                selectedClassTab === c.section
                  ? 'bg-[#171936] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search learner or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5145C5]/30"
          />
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FC] text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Learner</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Guardian & Relationship</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Home Language</th>
                <th className="py-3 px-4">Pedagogical Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLearners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    No learner records yet. Add a learner or import your own CSV to get started.
                  </td>
                </tr>
              ) : (
                filteredLearners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#171936]">
                        {learner.firstName} {learner.lastName}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {learner.learnerNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px]">
                        {learner.classSection}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800">{learner.guardianName}</span>
                      <span className="block text-[10px] text-gray-400">{learner.guardianRelationship}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="w-3 h-3 text-[#5145C5]" />
                        <span>{learner.guardianPhone}</span>
                      </div>
                      {learner.guardianEmail && (
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[150px]">
                          {learner.guardianEmail}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[10px]">
                        {OFFICIAL_LANGUAGES.find((l) => l.code === learner.homeLanguage)?.name || learner.homeLanguage}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {learner.specialNeedsNotes ? (
                        <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded line-clamp-1 border border-amber-200">
                          {learner.specialNeedsNotes}
                        </span>
                      ) : learner.academicNotes ? (
                        <span className="text-[11px] text-gray-600 line-clamp-1">
                          {learner.academicNotes}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(learner)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#5145C5] hover:bg-[#F0EEFF] transition-colors"
                          title="Edit learner profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(learner)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete learner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MODAL 1: ADD / EDIT LEARNER */}
      {/* ================================================================ */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-bold text-[#171936]">
                {editingLearner ? 'Edit Learner Profile' : 'Register New Learner'}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLearner} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Learner #</label>
                  <input
                    type="text"
                    value={formData.learnerNumber || ''}
                    onChange={(e) => setFormData({ ...formData, learnerNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Class Section</label>
                  <select
                    value={formData.classSection || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        classSection: e.target.value,
                        grade: e.target.value.replace(/[^\d]/g, ''),
                      })
                    }
                    className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="9A">9A (Natural Sciences)</option>
                    <option value="9B">9B (Natural Sciences)</option>
                    <option value="10B">10B (Life Sciences)</option>
                    <option value="11A">11A (Life Sciences)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Home Language</label>
                  <select
                    value={formData.homeLanguage || 'zu'}
                    onChange={(e) => setFormData({ ...formData, homeLanguage: e.target.value as LanguageCode })}
                    className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    {OFFICIAL_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t">
                <span className="font-bold text-gray-800 block mb-2">Guardian / Parent Details</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-600 block mb-1">Guardian Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Lindiwe Ndlovu"
                      value={formData.guardianName || ''}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-1">Relationship</label>
                    <select
                      value={formData.guardianRelationship || 'Mother'}
                      onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value as any })}
                      className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-gray-600 block mb-1">Phone Number (SA)</label>
                    <input
                      type="text"
                      placeholder="+27 82 123 4567"
                      value={formData.guardianPhone || ''}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.guardianEmail || ''}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Special Needs / Health Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Wears glasses, asthma inhaler in clinic"
                  value={formData.specialNeedsNotes || ''}
                  onChange={(e) => setFormData({ ...formData, specialNeedsNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5145C5] text-white font-bold hover:bg-[#4337b0]"
                >
                  {editingLearner ? 'Save Changes' : 'Register Learner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 2: CSV BATCH IMPORT WITH LOCAL PARSER & PREVIEW */}
      {/* ================================================================ */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-base font-bold text-[#171936]">
                  CSV Cohort Batch Import
                </h3>
                <p className="text-xs text-gray-500">
                  Local browser parsing • Header validation • Preview before database commit
                </p>
              </div>
              <button onClick={() => setShowCsvModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {csvStep === 'input' ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Paste CSV Contents or Load Header</span>
                  <button
                    type="button"
                    onClick={handleLoadSampleCsv}
                    className="flex items-center gap-1 text-[#5145C5] font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Load CSV Header</span>
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  placeholder="LearnerNumber,FirstName,LastName,Gender,Grade,Class,GuardianName,Relationship,Phone,Email,Language..."
                  className="w-full p-3 font-mono text-[11px] rounded-xl border border-gray-200"
                />

                <div className="p-3 bg-gray-50 rounded-xl text-gray-600 text-[11px] space-y-1">
                  <strong>Expected Headers:</strong>
                  <code> LearnerNumber, FirstName, LastName, Gender, Grade, Class, GuardianName, Relationship, Phone, Email, Language</code>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setShowCsvModal(false)}
                    className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleParseCsv}
                    className="px-4 py-2 rounded-xl bg-[#5145C5] text-white font-bold hover:bg-[#4337b0]"
                  >
                    Parse & Validate Records
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Verification Preview */
              <div className="space-y-4 text-xs">
                {/* Summary badges */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {parsedRows.filter((r) => r.isValid).length} Valid Records
                  </span>
                  {parsedRows.filter((r) => !r.isValid).length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">
                      {parsedRows.filter((r) => !r.isValid).length} Errors Detected
                    </span>
                  )}
                </div>

                {/* Preview Table */}
                <div className="border rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                      <tr>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Learner</th>
                        <th className="py-2 px-3">Class</th>
                        <th className="py-2 px-3">Guardian</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className={row.isValid ? 'bg-white' : 'bg-rose-50/60'}>
                          <td className="py-2 px-3">
                            {row.isValid ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            )}
                          </td>
                          <td className="py-2 px-3 font-semibold">
                            {row.learner.firstName} {row.learner.lastName}
                          </td>
                          <td className="py-2 px-3">{row.learner.classSection}</td>
                          <td className="py-2 px-3">{row.learner.guardianName}</td>
                          <td className="py-2 px-3">{row.learner.guardianPhone}</td>
                          <td className="py-2 px-3">
                            {row.isValid ? (
                              <span className="text-emerald-700 font-bold">Ready</span>
                            ) : (
                              <span className="text-rose-700 font-bold">{row.errors.join(', ')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <button
                    onClick={() => setCsvStep('input')}
                    className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                  >
                    Back to Edit CSV
                  </button>
                  <button
                    onClick={handleConfirmCsvImport}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Confirm Import ({parsedRows.filter((r) => r.isValid).length} Learners)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
