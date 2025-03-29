"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { DocumentArrowDownIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

// CV tema tipleri
type ThemeColors = {
  primary: string;
  secondary: string;
  text: string;
  accent: string;
};

type Theme = {
  name: string;
  layout: string;
  colors: ThemeColors;
};

type Themes = {
  [key: string]: Theme;
};

// Tema seçenekleri
const CV_THEMES: Themes = {
  modern: {
    name: "Koyu",
    layout: "grid-cols-[250px_1fr]",
    colors: {
      primary: "bg-[#1e2532]",
      secondary: "text-blue-400",
      text: "text-white",
      accent: "bg-blue-900/50",
    }
  },
  minimal: {
    name: "Beyaz",
    layout: "grid-cols-1",
    colors: {
      primary: "bg-white",
      secondary: "text-gray-700",
      text: "text-black",
      accent: "bg-black",
    }
  },
  professional: {
    name: "Yeşil",
    layout: "grid-cols-[250px_1fr]",
    colors: {
      primary: "bg-[#2C5530]",
      secondary: "text-emerald-400",
      text: "text-white",
      accent: "bg-emerald-900/50",
    }
  },
};

// Buton sınıflarını düzenleyelim
const buttonClasses = `mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200`;
const deleteButtonClasses = `text-red-500 hover:text-red-700 transition-colors duration-200`;

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("modern");
  const [language, setLanguage] = useState("tr");
  const [formData, setFormData] = useState({
    fullName: "",
    job: "",
    email: "",
    phone: "",
    profile: "",
    skills: [] as string[],
    education: [] as { school: string; degree: string; year: string }[],
    experience: [] as { company: string; position: string; year: string; description: string }[],
    references: [] as { name: string; position: string; contact: string }[],
    photo: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const cvRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", position: "", year: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { name: "", position: "", contact: "" }],
    }));
  };

  const updateReference = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      ),
    }));
  };

  const removeReference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const downloadAsPNG = async () => {
    if (cvRef.current) {
      try {
        const dataUrl = await toPng(cvRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          skipAutoScale: true,
          backgroundColor: selectedTheme === 'minimal' ? '#ffffff' : 
                          selectedTheme === 'modern' ? '#1e2532' : 
                          '#2C5530',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '210mm',
            height: '297mm'
          }
        });
        
        const link = document.createElement('a');
        link.download = 'cv.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main className={`min-h-screen p-4 md:p-8 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Tema Seçimi ve Karanlık Mod */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {Object.entries(CV_THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors duration-200 text-sm md:text-base ${
                  selectedTheme === key
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => setLanguage("tr")}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors duration-200 text-sm md:text-base ${
                language === "tr"
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors duration-200 text-sm md:text-base ${
                language === "en"
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <MoonIcon className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Form Bölümü */}
          <div className={`p-4 md:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} order-2 lg:order-1`}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{language === "tr" ? "CV Bilgileri" : "CV Information"}</h2>
            
            {/* Temel Bilgiler */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">{language === "tr" ? "Ad Soyad" : "Full Name"}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === "tr" ? "Meslek" : "Job Title"}</label>
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === "tr" ? "E-posta" : "Email"}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === "tr" ? "Telefon" : "Phone"}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>

            {/* Profil */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium mb-1">{language === "tr" ? "Profil" : "Profile"}</label>
              <textarea
                name="profile"
                value={formData.profile}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            {/* Yetenekler */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">{language === "tr" ? "Yetenekler" : "Skills"}</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={language === "tr" ? "Yeni yetenek ekle" : "Add new skill"}
                  className={`flex-1 p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <button
                  onClick={handleSkillAdd}
                  className={buttonClasses}
                >
                  {language === "tr" ? "Ekle" : "Add"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-full flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className={deleteButtonClasses}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Eğitim */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">{language === "tr" ? "Eğitim" : "Education"}</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{language === "tr" ? "Eğitim" : "Education"} {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(index)}
                      className={deleteButtonClasses}
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Okul/Üniversite" : "School/University"}
                      value={edu.school}
                      onChange={(e) => updateEducation(index, "school", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Derece" : "Degree"}
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Yıl" : "Year"}
                      value={edu.year}
                      onChange={(e) => updateEducation(index, "year", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addEducation}
                className={buttonClasses}
              >
                {language === "tr" ? "Eğitim Ekle" : "Add Education"}
              </button>
            </div>

            {/* Deneyim */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">{language === "tr" ? "Deneyim" : "Experience"}</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{language === "tr" ? "Deneyim" : "Experience"} {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(index)}
                      className={deleteButtonClasses}
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Şirket" : "Company"}
                      value={exp.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Pozisyon" : "Position"}
                      value={exp.position}
                      onChange={(e) => updateExperience(index, "position", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Yıl" : "Year"}
                      value={exp.year}
                      onChange={(e) => updateExperience(index, "year", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <textarea
                      placeholder={language === "tr" ? "Açıklama" : "Description"}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                className={buttonClasses}
              >
                {language === "tr" ? "Deneyim Ekle" : "Add Experience"}
              </button>
            </div>

            {/* Referanslar */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">{language === "tr" ? "Referanslar" : "References"}</h3>
              {formData.references.map((ref, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{language === "tr" ? "Referans" : "Reference"} {index + 1}</h4>
                    <button
                      onClick={() => removeReference(index)}
                      className={deleteButtonClasses}
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={language === "tr" ? "İsim" : "Name"}
                      value={ref.name}
                      onChange={(e) => updateReference(index, "name", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder={language === "tr" ? "Pozisyon" : "Position"}
                      value={ref.position}
                      onChange={(e) => updateReference(index, "position", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder={language === "tr" ? "İletişim" : "Contact"}
                      value={ref.contact}
                      onChange={(e) => updateReference(index, "contact", e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addReference}
                className={buttonClasses}
              >
                {language === "tr" ? "Referans Ekle" : "Add Reference"}
              </button>
            </div>

            {/* Fotoğraf Yükleme */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">{language === "tr" ? "Fotoğraf" : "Photo"}</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>

          {/* CV Önizleme */}
          <div className="relative order-1 lg:order-2">
            <div
              ref={cvRef}
              className={`p-4 md:p-8 rounded-lg shadow-md min-h-[297mm] w-[210mm] mx-auto overflow-hidden scale-[0.5] md:scale-100 origin-top-left ${
                CV_THEMES[selectedTheme].colors.primary
              } ${CV_THEMES[selectedTheme].colors.text}`}
            >
              <div className={`grid grid-cols-[1fr_2px_1fr] gap-4 md:gap-8`}>
                {/* Sol Kolon */}
                <div className="space-y-4 md:space-y-6">
                  {formData.photo && (
                    <div className="mb-4 md:mb-6">
          <Image
                        src={formData.photo}
                        alt="Profil"
                        width={192}
                        height={192}
                        className={`w-32 h-32 md:w-48 md:h-48 ${selectedTheme === 'minimal' ? 'rounded-lg' : 'rounded-full'} object-cover mx-auto`}
                        unoptimized
                      />
                    </div>
                  )}
                  
                  <div>
                    <h2 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${CV_THEMES[selectedTheme].colors.secondary}`}>
                      {language === "tr" ? "İletişim" : "Contact"}
                    </h2>
                    <div className={`space-y-1 md:space-y-2 ${selectedTheme === "minimal" ? "text-black" : "text-gray-300"}`}>
                      <p className="text-sm md:text-base">{formData.email}</p>
                      <p className="text-sm md:text-base">{formData.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${CV_THEMES[selectedTheme].colors.secondary}`}>
                      {language === "tr" ? "Yetenekler" : "Skills"}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-sm md:text-base ${CV_THEMES[selectedTheme].colors.accent} ${
                            selectedTheme === 'minimal' ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${CV_THEMES[selectedTheme].colors.secondary}`}>
                      {language === "tr" ? "Eğitim" : "Education"}
                    </h2>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="mb-4">
                        <h3 className={`text-base font-medium ${selectedTheme === 'minimal' ? 'text-gray-900' : 'text-gray-300'} break-words`}>
                          {edu.school}
                        </h3>
                        <p className={`text-sm ${selectedTheme === 'minimal' ? 'text-gray-700' : 'text-gray-400'} break-words`}>
                          {edu.degree}
                        </p>
                        <p className={`text-sm ${selectedTheme === 'minimal' ? 'text-gray-600' : 'text-gray-500'}`}>
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Çizgi */}
                <div className={`bg-gray-400 w-[2px]`}></div>

                {/* Sağ Kolon */}
                <div className="space-y-6 overflow-hidden">
                  <div className="mb-8">
                    <h1 className={`text-3xl md:text-4xl font-bold mb-2 break-words ${
                      selectedTheme === 'minimal' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {formData.fullName}
                    </h1>
                    <p className={`text-lg md:text-xl ${CV_THEMES[selectedTheme].colors.secondary} break-words`}>
                      {formData.job}
                    </p>
                  </div>

                  <div className="overflow-hidden">
                    <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${CV_THEMES[selectedTheme].colors.secondary}`}>
                      {language === "tr" ? "Profil" : "Profile"}
                    </h2>
                    <p className={`whitespace-pre-wrap break-words overflow-hidden text-sm md:text-base ${
                      selectedTheme === 'minimal' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {formData.profile}
                    </p>
                  </div>

                  <div className="overflow-hidden">
                    <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${CV_THEMES[selectedTheme].colors.secondary}`}>
                      {language === "tr" ? "Deneyim" : "Experience"}
                    </h2>
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="mb-6">
                        <h3 className={`text-lg font-medium ${selectedTheme === 'minimal' ? 'text-gray-900' : 'text-gray-300'} break-words`}>
                          {exp.company}
                        </h3>
                        <p className={`text-base ${selectedTheme === 'minimal' ? 'text-gray-700' : 'text-gray-400'} break-words`}>
                          {exp.position}
                        </p>
                        <p className={`text-sm ${selectedTheme === 'minimal' ? 'text-gray-600' : 'text-gray-500'}`}>
                          {exp.year}
                        </p>
                        <p className={`whitespace-pre-wrap break-words text-sm md:text-base ${
                          selectedTheme === 'minimal' ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-hidden">
                    <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${CV_THEMES[selectedTheme].colors.secondary}`}>
                      {language === "tr" ? "Referanslar" : "References"}
                    </h2>
                    {formData.references.map((ref, index) => (
                      <div key={index} className="mb-4">
                        <h3 className={`text-base font-medium ${CV_THEMES[selectedTheme].colors.secondary} break-words`}>
                          {ref.name}
                        </h3>
                        <p className={`text-sm ${CV_THEMES[selectedTheme].colors.secondary} break-words`}>
                          {ref.position}
                        </p>
                        <p className={`text-sm ${CV_THEMES[selectedTheme].colors.secondary} break-words`}>
                          {ref.contact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadAsPNG}
              className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg hover:bg-blue-600 flex items-center gap-2 text-sm md:text-base z-50"
            >
              <DocumentArrowDownIcon className="h-5 w-5 md:h-6 md:w-6" />
              <span>{language === "tr" ? "İndir" : "Download"}</span>
            </button>
          </div>
        </div>
    </div>
    </main>
  );
}
