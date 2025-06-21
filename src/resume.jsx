// ResumePDF.jsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#0e374e',
  },
  item: {
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
});

const ResumePDF = ({ details, educations, projectsList, achievementsList, skillsList }) => (
<div id="resume-preview" className="flex flex-grow justify-center border border-gray-300 h-screen rounded-sm ml-4 mr-10 mt-4 bg-white overflow-auto">
        <div className="w-full px-6 py-6">
          <div className="bg-black py-9 px-6 rounded-t-md">
            <h1 className="text-white text-center text-3xl font-bold">
              {details.fullName || 'Full Name'}
            </h1>
            <div className="flex flex-col gap-[18px] w-fit mx-auto sm:flex-row sm:flex-wrap sm:justify-center mt-4">
              <div className="flex items-center flex-wrap gap-1.5">
                <Mail className="w-6 h-6 text-white" />
                <span className="text-white">{details.email || 'example@mail.com'}</span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                <Phone className="w-6 h-6 text-white" />
                <span className="text-white">{details.phone || '+91 1234567890'}</span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                <MapPin className="w-6 h-6 text-white" />
                <span className="text-white">{details.address || 'City, Country'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {educations.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Education</h2>
                <hr className='text-xl font-bold'></hr>
                {educations.map((edu) => (
                  <div key={edu.id} className="flex flex-row mb-2 justify-between mt-2">
                    <div className='flex flex-col'>
                      <div className="font-semibold text-gray-800">{edu.schoolName}</div>
                      <div className="text-sm text-gray-600">
                        {edu.degree}, CGPA : {edu.cgpa}
                      </div>
                    </div>
                    <div className='flex flex-col justify-start'>
                      <div className="text-sm text-gray-500 justify-end font-semibold">
                        {edu.location}
                      </div >
                      <div className="text-sm text-gray-500 font-semibold justify-end">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projectsList.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Projects</h2>
                {projectsList.map((proj) => (
                  <div>
                    <div key={proj.id} className="text-gray-700 font-semibold">• {proj.name}</div>
                    <div className="text-gray-500 text-sm ml-3 mt-2">Tools: {proj.tools}</div>
                    <div className="text-gray-500 text-sm ml-3 mt-2">{proj.description}</div>
                  </div>
                ))}
              </div>
            )}

            {achievementsList.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Achievements</h2>
                {achievementsList.map((ach) => (
                  <div key={ach.id} className="text-gray-700">• {ach.name}</div>
                ))}
              </div>
            )}

            {skillsList.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Technical Skills</h2>
                <div className="text-gray-700">{skillsList.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
);

export default ResumePDF;
