import { useRef, useState } from 'react';
import {
  FileText,
  Wrench,
  Download,
  Trash,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Plus,
} from 'lucide-react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import uniqid from 'uniqid';

function App() {
  const [active, setActive] = useState('content');
  const [details, setDetails] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [isOpenEdu, setIsOpenEdu] = useState(false);
  const [isOpenSkill, setIsOpenSkill] = useState(false);
  const [isOpenProject, setIsOpenProject] = useState(false);
  const [isOpenAchievement, setIsOpenAchievement] = useState(false);

  const [educations, setEducations] = useState([]);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [newEducation, setNewEducation] = useState({
    degree: '', schoolName: '', location: '', startDate: '', endDate: '', cgpa: ''
  });

  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [projectsList, setProjectsList] = useState([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', tools: '', description: '' });

  const [achievementsList, setAchievementsList] = useState([]);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');

  const toggleDropdownEdu = () => setIsOpenEdu(!isOpenEdu);
  const toggleDropdownSkill = () => setIsOpenSkill(!isOpenSkill);
  const toggleDropdownProject = () => setIsOpenProject(!isOpenProject);
  const toggleDropdownAchievement = () => setIsOpenAchievement(!isOpenAchievement);

  const saveEducation = () => {
    const completeEducation = { ...newEducation, id: uniqid(), isEditing: false };
    setEducations([...educations, completeEducation]);
    setNewEducation({ degree: '', schoolName: '', location: '', startDate: '', endDate: '', cgpa: '' });
    setIsAddingEducation(false);
  };

  const saveProject = () => {
    if (newProject.name.trim()) {
      setProjectsList([...projectsList, { id: uniqid(), ...newProject, isEditing: false }]);
      setNewProject({ name: '', tools: '', description: '' });
      setIsAddingProject(false);
    }
  };

  const saveAchievement = () => {
    if (newAchievement.trim()) {
      setAchievementsList([...achievementsList, { id: uniqid(), name: newAchievement, isEditing: false }]);
      setNewAchievement('');
      setIsAddingAchievement(false);
    }
  };

  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;

    // Capture the component as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Improves resolution
      useCORS: true, // For external images
    });

    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('download.pdf');
  };

const handleDownload = async () => {
  const resume = document.getElementById('resume-preview');
  if (!resume) return;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <!-- Tailwind CDN -->
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

        <style>
          /* Ensure background colors and layout are preserved in print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          /* Fix for dark background in PDF */
          .bg-[#0e374e] {
            background-color: #0e374e !important;
          }

          /* Ensure white text shows over dark bg */
          .text-white {
            color: white !important;
          }

          /* Fix Tailwind's arbitrary color class not working in Puppeteer */
          .text-gray {
            color: black;
          }
        </style>
      </head>
      <body>
        ${resume.outerHTML}
      </body>
    </html>
  `;

  try {
    const response = await fetch('http://localhost:4000/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    });

    if (!response.ok) throw new Error('Failed to generate PDF');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    link.click();
  } catch (err) {
    console.error('PDF generation error:', err);
  }
};



  const clearResume = () => {
    setDetails([]);
    setEducations([]);
    setProjectsList([]);
    setAchievementsList([]);
    setNewProject({ name: '', tools: '', description: '' });
    setSkillsList([]);
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex flex-col w-[200px] bg-white rounded-xl py-6 px-4 gap-4 shadow items-center max-h-62 mt-4 ml-10">
        <button
          onClick={() => setActive('content')}
          className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl w-full transition ${active === 'content' ? 'bg-gray-100 text-sky-900' : 'bg-white text-black hover:bg-gray-50'}`}
        >
          <FileText className="w-6 h-6 mb-2" />
          <span className="font-semibold">Content</span>
        </button>

        <button
          onClick={() => setActive('customize')}
          className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl w-full transition ${active === 'customize' ? 'bg-gray-100 text-sky-900' : 'bg-white text-black hover:bg-gray-50'}`}
        >
          <Wrench className="w-6 h-6 mb-2" />
          <span className="font-semibold">Customize</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col mt-4 ml-4 w-[450px]">
        {/* Action Buttons */}
        <div className="flex bg-white rounded-xl shadow w-full px-4 items-center justify-between">
          <button className="flex items-center justify-center my-3 rounded-xl w-[180px]">
            <Trash className="w-5 h-5 mr-2" />
            <span onClick={clearResume} className="font-semibold">Clear Resume</span>
          </button>

          <button className="flex items-center justify-center my-3 rounded-xl bg-gray-100 text-sky-900 px-1 w-[180px]">
            <Download className="w-5 h-5 mb-2 mr-2 mt-2" />
            <span onClick={handleDownload} className="font-semibold">Download Resume</span>
          </button>
        </div>

        {/* Personal Details */}
        <div className="flex flex-col bg-white rounded-xl mt-4">
          <form className="p-5">
            <h1 className="font-semibold text-2xl">Personal Details</h1>
            {['fullName', 'email', 'phone', 'address'].map((field) => (
              <div className="mt-4" key={field}>
                <label className="font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  value={details[field]}
                  onChange={(e) => setDetails({ ...details, [field]: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mt-3"
                  placeholder={field === 'email' ? 'example@mail.com' : field === 'phone' ? '+91 1234567890' : 'Enter...'}
                />
              </div>
            ))}
          </form>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-xl mt-4 shadow">
          <button onClick={toggleDropdownEdu} className="flex flex-row items-center justify-between p-5 w-full">
            <h1 className="font-semibold text-2xl">Education</h1>
            <ChevronDown className={`w-6 h-6 text-black transition-transform duration-300 ${isOpenEdu ? 'rotate-180' : ''}`} />
          </button>
          {isOpenEdu && (
            <div className="p-5 border-t border-gray-200">
              {educations.map((edu) => (
                <div key={edu.id} className="mb-3 border p-3 rounded-lg relative">
                  <button onClick={() => setEducations(educations.filter((e) => e.id !== edu.id))} className="absolute right-2 text-red-500 hover:text-red-700" title="Delete">
                    <Trash className="w-4 h-5" />
                  </button>

                  {edu.isEditing ? (
                    <>
                      {['degree', 'schoolName', 'location', 'startDate', 'endDate','cgpa'].map((field) => (
                        <input
                          key={field}
                          type="text"
                          value={edu[field]}
                          onChange={(e) => setEducations((prev) => prev.map((item) => item.id === edu.id ? { ...item, [field]: e.target.value } : item))}
                          className="mb-2 block w-full p-2 border rounded"
                          placeholder={field}
                        />
                      ))}
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEducations((prev) => prev.map((item) => item.id === edu.id ? { ...item, isEditing: false } : item))} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                          Save
                        </button>
                        <button onClick={() => setEducations((prev) => prev.map((item) => item.id === edu.id ? { ...item, isEditing: false } : item))} className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-gray-600"></div>
                      <div className="flex">
                        <button onClick={() => setEducations((prev) => prev.map((item) => item.id === edu.id ? { ...item, isEditing: true } : item))} className="font-semibold text-gray-600 text-l mb-2text-black rounded ">
                          {edu.schoolName}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {isAddingEducation && (
                <div className="border border-white rounded-lg mb-4">
                  {['degree', 'schoolName', 'location', 'startDate', 'endDate','cgpa'].map((field) => (
                    <div className='mt-2' key={field}>
                      <label className="font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                      <input
                        type="text"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={newEducation[field]}
                        onChange={(e) => setNewEducation({ ...newEducation, [field]: e.target.value })}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mt-2"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsAddingEducation(false)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-black mt-4">
                      Cancel
                    </button>
                    <button onClick={saveEducation} className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700 mt-4">
                      Save
                    </button>
                  </div>
                </div>
              )}

              {!isAddingEducation && (
                <div className="flex justify-center">
                  <button onClick={() => setIsAddingEducation(true)} className="flex items-center p-3 border border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200">
                    <Plus className="w-4 h-4 text-black mr-2" />
                    <span className="font-semibold">Add Education</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Technical Skills Section */}
        <div className="bg-white rounded-xl mt-4 shadow">
          <button
            onClick={toggleDropdownSkill}
            className="flex flex-row items-center justify-between p-5 w-full"
          >
            <h1 className="font-semibold text-2xl">Technical Skills</h1>
            <ChevronDown
              className={`w-6 h-6 text-black transition-transform duration-300 ${
                isOpenSkill ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isOpenSkill && (
            <div className="p-5 border-t border-gray-200">
              <div className="mb-4 space-y-2">
                {skillsList.map((skill, index) => (
                  <div
                    key={index}
                    className="text-gray-700 flex justify-between items-center p-2 border rounded"
                  >
                    <span>{skill}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const updated = skillsList.filter((_, i) => i !== index);
                        setSkillsList(updated);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Enter a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => {
                      if (newSkill.trim()) {
                        setSkillsList([...skillsList, newSkill.trim()]);
                        setNewSkill('');
                      }
                    }}
                    className="flex items-center justify-center p-3 border border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200 max-w-50"
                  >
                    <Plus className="w-4 h-4 text-black mr-2" />
                    <span className='font-semibold'>Technical Skills</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Projects Section */}
        <div className="bg-white rounded-xl mt-4 shadow">
          <button
            onClick={toggleDropdownProject}
            className="flex flex-row items-center justify-between p-5 w-full"
          >
            <h1 className="font-semibold text-2xl">Projects</h1>
            <ChevronDown
              className={`w-6 h-6 text-black transition-transform duration-300 ${isOpenProject ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpenProject && (
            <div className="p-5 border-t border-gray-200">
              <ul className="mb-4">
                {projectsList.map((proj) => (
                  <li key={proj.id} className="text-gray-700 mb-3 border p-3 rounded-lg relative">
                    {proj.isEditing ? (
                      <div>
                        {['name', 'tools', 'description'].map((field) => (
                          <input
                            key={field}
                            type="text"
                            value={proj[field]}
                            onChange={(e) =>
                              setProjectsList((prev) =>
                                prev.map((item) =>
                                  item.id === proj.id ? { ...item, [field]: e.target.value } : item
                                )
                              )
                            }
                            className="mb-2 block w-full p-2 border rounded"
                            placeholder={`Enter ${field}`}
                          />
                        ))}
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              setProjectsList((prev) =>
                                prev.map((item) =>
                                  item.id === proj.id ? { ...item, isEditing: false } : item
                                )
                              )
                            }
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setProjectsList((prev) =>
                                prev.map((item) =>
                                  item.id === proj.id ? { ...item, isEditing: false } : item
                                )
                              )
                            }
                            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{proj.name}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setProjectsList((prev) =>
                                prev.map((item) =>
                                  item.id === proj.id ? { ...item, isEditing: true } : item
                                )
                              )
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setProjectsList(projectsList.filter((p) => p.id !== proj.id))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

            {isAddingProject ? (
              <div className="mb-4">
                {['name', 'tools', 'description'].map((field) => (
                  <div className="mt-2" key={field}>
                    <label className="font-semibold capitalize">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === 'description' ? (
                      <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-2"
                        placeholder="Enter description (one line per bullet)"
                        value={newProject[field]}
                        onChange={(e) =>
                          setNewProject({ ...newProject, [field]: e.target.value })
                        }
                        rows={4}
                      />
                    ) : (
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-2"
                        placeholder={`Enter ${field}`}
                        value={newProject[field]}
                        onChange={(e) =>
                          setNewProject({ ...newProject, [field]: e.target.value })
                        }
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsAddingProject(false)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-black"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProject}
                    className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsAddingProject(true)}
                  className="flex items-center p-3 border border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4 text-black mr-2" />
                  <span className="font-semibold">Add Project</span>
                </button>
              </div>
            )}
            </div>
          )}
        </div>


        {/* Achievements Section */}
        <div className="bg-white rounded-xl mt-4 shadow">
          <button
            onClick={toggleDropdownAchievement}
            className="flex flex-row items-center justify-between p-5 w-full"
          >
            <h1 className="font-semibold text-2xl">Achievements</h1>
            <ChevronDown
              className={`w-6 h-6 text-black transition-transform duration-300 ${
                isOpenAchievement ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isOpenAchievement && (
            <div className="p-5 border-t border-gray-200">
              <ul className="mb-4">
                {achievementsList.map((ach) => (
                  <li key={ach.id} className="text-gray-700 mb-1 flex">
                    {ach.isEditing ? (
                    <>
                      {['name'].map((field) => (
                        <input
                          key={field}
                          type="text"
                          value={ach[field]}
                          onChange={(e) => setAchievementsList((prev) => prev.map((item) => item.id === ach.id ? { ...item, [field]: e.target.value } : item))}
                          className="mb-2 block w-full p-2 border rounded"
                          placeholder={field}
                        />
                      ))}
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setAchievementsList((prev) => prev.map((item) => item.id === ach.id ? { ...item, isEditing: false } : item))} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                          Save
                        </button>
                        <button onClick={() => setAchievementsList((prev) => prev.map((item) => item.id === ach.id ? { ...item, isEditing: false } : item))} className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-gray-600"></div>
                      <div className="flex flex-row ">
                        <button onClick={() => setAchievementsList((prev) => prev.map((item) => item.id === ach.id ? { ...item, isEditing: true } : item))} className="font-semibold text-gray-600 text-l mb-2 text-black rounded ">
                          {ach.name}
                        </button>
                      </div>
                    </>
                  )}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setAchievementsList(achievementsList.filter(a => a.id !== ach.id))}
                    >
                      <Trash className="w-4 h-4 ml-90" />
                    </button>
                  </li>
                ))}
              </ul>
              {isAddingAchievement ? (
                <div className="mb-4">
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-2"
                    placeholder="Achievement Title"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsAddingAchievement(false)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-black">
                      Cancel
                    </button>
                    <button onClick={saveAchievement} className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button onClick={() => setIsAddingAchievement(true)} className="flex items-center p-3 border border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200">
                    <Plus className="w-4 h-4 text-black mr-2" />
                    <span className="font-semibold">Add Achievement</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div ref = {printRef} id="resume-preview" className="flex flex-grow justify-center border border-white h-full min-h-screen rounded-sm ml-4 mr-10 mt-4 bg-white overflow-auto">
        <div className="w-full px-4 py-4">
          <div style={{ backgroundColor: '#0e374e' }} className="bg-[#0e374e] py-3 px-3 rounded-t-md mb-2">
            <h1 className="text-white text-center text-2xl font-bold">
              {details.fullName || 'Full Name'}
            </h1>
            <div className="flex flex-col gap-[25px] w-fit mx-auto sm:flex-row sm:flex-wrap sm:justify-center mt-4">
              <div className="flex items-center flex-wrap gap-1.5">
                <Mail className="w-4 h-4 text-white text-l" />
                <span className="text-white text-sm">{details.email || 'example@mail.com'}</span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                <Phone className="w-4 h-4 text-white text-l" />
                <span className="text-white text-sm">{details.phone || '+91 1234567890'}</span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                <MapPin className="w-4 h-4 text-white text-l" />
                <span className="text-white text-sm">{details.address || 'City, Country'}</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            {educations.length > 0 && (
              <div className="mb-2">
                <h2 className="text-xl font-bold text-gray mb-1">Education</h2>
                <hr className='text-l font-bold'></hr>
                {educations.map((edu) => (
                  <div key={edu.id} className="flex flex-row mb-1 justify-between mt-2">
                    <div className='flex flex-col'>
                      <div className="font-semibold text-gray">{edu.schoolName}</div>
                      <div className="text-sm text-gray">
                        {edu.degree}, CGPA : {edu.cgpa}
                      </div>
                    </div>
                    <div className='flex flex-col justify-start'>
                      <div className="text-sm text-gray justify-end font-semibold">
                        {edu.location}
                      </div >
                      <div className="text-sm text-gray font-semibold justify-end">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {skillsList.length > 0 && (
              <div className="mb-2">
                <h2 className="text-xl font-bold text-gray mb-1">Technical Skills</h2>
                <hr className='text-l font-bold mb-1'></hr>
                <ul className="list-disc list-inside text-gray text-sm space-y-1">
                  {skillsList.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {projectsList.length > 0 && (
              <div className="mb-2">
                <h2 className="text-xl font-bold text-gray mb-1">Projects</h2>
                <hr className='text-l font-bold mb-2'></hr>
                {projectsList.map((proj) => (
                  <div>
                    <div key={proj.id} className="text-gray font-semibold mt-2">• {proj.name}</div>
                    <div className="text-gray text-sm ml-3 ">Tools: {proj.tools}</div>
                    <ul className="list-disc ml-8 text-gray text-sm mt-1 space-y-1">
                    {proj.description
                      .split('\n')
                      .filter(line => line.trim() !== '')
                      .map((line, i) => (
                        <li key={i}>{line.trim()}</li>
                      ))}
                  </ul>
                  </div>
                ))}
              </div>
            )}

            {achievementsList.length > 0 && (
              <div className="mb-2">
                <h2 className="text-xl font-bold text-gray mb-1">Achievements</h2>
                <hr className='text-l font-bold mb-2'></hr>
                {achievementsList.map((ach) => (
                  <div key={ach.id} className="text-gray text-sm">• {ach.name}</div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;