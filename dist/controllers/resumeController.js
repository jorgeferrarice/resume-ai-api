"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomSuggestions = exports.matchJobDescription = exports.enhanceResume = exports.analyzeResume = exports.deleteResume = exports.updateResume = exports.createResume = exports.getResumeById = exports.getAllResumes = void 0;
const openaiService_1 = require("../services/openaiService");
let resumes = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        title: 'Software Engineer',
        summary: 'Experienced software engineer with 5+ years in web development',
        experience: [
            {
                company: 'Tech Corp',
                position: 'Senior Developer',
                duration: '2020-2023',
                description: 'Led development of web applications using React and Node.js'
            }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        education: [
            {
                institution: 'University of Technology',
                degree: 'Bachelor of Computer Science',
                year: '2018'
            }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
const getAllResumes = async (req, res) => {
    try {
        const { page = '1', limit = '10', search } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        let filteredResumes = resumes;
        if (search) {
            filteredResumes = resumes.filter(resume => resume.name.toLowerCase().includes(search.toLowerCase()) ||
                resume.title.toLowerCase().includes(search.toLowerCase()) ||
                (resume.skills && resume.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))));
        }
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = pageNum * limitNum;
        const paginatedResumes = filteredResumes.slice(startIndex, endIndex);
        res.json({
            success: true,
            data: paginatedResumes,
            pagination: {
                current: pageNum,
                total: Math.ceil(filteredResumes.length / limitNum),
                count: paginatedResumes.length,
                totalItems: filteredResumes.length
            }
        });
    }
    catch (error) {
        console.error('Error in getAllResumes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resumes'
        });
    }
};
exports.getAllResumes = getAllResumes;
const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = resumes.find(r => r.id === parseInt(id, 10));
        if (!resume) {
            res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
            return;
        }
        res.json({
            success: true,
            data: resume
        });
    }
    catch (error) {
        console.error('Error in getResumeById:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resume'
        });
    }
};
exports.getResumeById = getResumeById;
const createResume = async (req, res) => {
    try {
        const { name, email, title, summary, experience, skills, education } = req.body;
        if (!name || !email || !title) {
            res.status(400).json({
                success: false,
                error: 'Name, email, and title are required'
            });
            return;
        }
        const newResume = {
            id: resumes.length + 1,
            name,
            email,
            title,
            summary: summary || '',
            experience: experience || [],
            skills: skills || [],
            education: education || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        resumes.push(newResume);
        res.status(201).json({
            success: true,
            data: newResume,
            message: 'Resume created successfully'
        });
    }
    catch (error) {
        console.error('Error in createResume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create resume'
        });
    }
};
exports.createResume = createResume;
const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resumeIndex = resumes.findIndex(r => r.id === parseInt(id, 10));
        if (resumeIndex === -1) {
            res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
            return;
        }
        const updatedResume = {
            ...resumes[resumeIndex],
            ...req.body,
            id: parseInt(id, 10),
            updatedAt: new Date().toISOString()
        };
        resumes[resumeIndex] = updatedResume;
        res.json({
            success: true,
            data: updatedResume,
            message: 'Resume updated successfully'
        });
    }
    catch (error) {
        console.error('Error in updateResume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update resume'
        });
    }
};
exports.updateResume = updateResume;
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resumeIndex = resumes.findIndex(r => r.id === parseInt(id, 10));
        if (resumeIndex === -1) {
            res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
            return;
        }
        resumes.splice(resumeIndex, 1);
        res.json({
            success: true,
            message: 'Resume deleted successfully'
        });
    }
    catch (error) {
        console.error('Error in deleteResume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete resume'
        });
    }
};
exports.deleteResume = deleteResume;
const analyzeResume = async (req, res) => {
    try {
        const { resumeContent, industryFocus, includeKeywords } = req.body;
        if (!resumeContent) {
            res.status(400).json({
                success: false,
                error: 'Resume content is required'
            });
            return;
        }
        const result = await openaiService_1.openaiService.analyzeResume({
            resumeContent,
            industryFocus,
            includeKeywords
        });
        if (!result.success || !result.data) {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to analyze resume'
            });
            return;
        }
        res.json({
            success: true,
            data: result.data,
            message: 'Resume analysis completed',
            ...(result.usage && { usage: result.usage })
        });
    }
    catch (error) {
        console.error('Error in analyzeResume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze resume'
        });
    }
};
exports.analyzeResume = analyzeResume;
const enhanceResume = async (req, res) => {
    try {
        const { resumeContent, targetRole, tone, improvements } = req.body;
        if (!resumeContent) {
            res.status(400).json({
                success: false,
                error: 'Resume content is required'
            });
            return;
        }
        const result = await openaiService_1.openaiService.enhanceResume({
            resumeContent,
            targetRole,
            tone,
            improvements
        });
        if (!result.success || !result.data) {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to enhance resume'
            });
            return;
        }
        res.json({
            success: true,
            data: result.data,
            message: 'Resume enhancement completed',
            ...(result.usage && { usage: result.usage })
        });
    }
    catch (error) {
        console.error('Error in enhanceResume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to enhance resume'
        });
    }
};
exports.enhanceResume = enhanceResume;
const matchJobDescription = async (req, res) => {
    try {
        const { resumeContent, jobDescription, focusAreas } = req.body;
        if (!resumeContent || !jobDescription) {
            res.status(400).json({
                success: false,
                error: 'Both resume content and job description are required'
            });
            return;
        }
        const result = await openaiService_1.openaiService.matchJobDescription({
            resumeContent,
            jobDescription,
            focusAreas
        });
        if (!result.success || !result.data) {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to match resume to job description'
            });
            return;
        }
        res.json({
            success: true,
            data: result.data,
            message: 'Job matching analysis completed',
            ...(result.usage && { usage: result.usage })
        });
    }
    catch (error) {
        console.error('Error in matchJobDescription:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to match resume to job description'
        });
    }
};
exports.matchJobDescription = matchJobDescription;
const getCustomSuggestions = async (req, res) => {
    try {
        const { resumeContent, criteria, temperature, maxTokens } = req.body;
        if (!resumeContent || !criteria) {
            res.status(400).json({
                success: false,
                error: 'Resume content and criteria are required'
            });
            return;
        }
        const result = await openaiService_1.openaiService.getCustomSuggestions(resumeContent, criteria, {
            temperature,
            max_tokens: maxTokens
        });
        if (!result.success || !result.data) {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to generate suggestions'
            });
            return;
        }
        res.json({
            success: true,
            data: result.data,
            message: 'Custom suggestions generated',
            ...(result.usage && { usage: result.usage })
        });
    }
    catch (error) {
        console.error('Error in getCustomSuggestions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate custom suggestions'
        });
    }
};
exports.getCustomSuggestions = getCustomSuggestions;
//# sourceMappingURL=resumeController.js.map