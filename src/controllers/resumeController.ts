// Resume controller with basic CRUD operations and AI features

import { Request, Response } from 'express';
import {
  Resume,
  CreateResumeRequest,
  UpdateResumeRequest,
  ApiResponse,
  PaginatedResponse,
  ResumeAnalysis,
  ResumeEnhancement,
  JobMatchAnalysis,
  TypedRequest,
  ResumeQueryParams,
  ResumeParams,
  AnalysisRequest,
  EnhancementRequest,
  JobMatchRequest
} from '../types';
import { openaiService } from '../services/openaiService';

// Mock data storage (replace with database in production)
let resumes: Resume[] = [
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

// Get all resumes
export const getAllResumes = async (
  req: Request<{}, PaginatedResponse<Resume>, {}, ResumeQueryParams>,
  res: Response<PaginatedResponse<Resume>>
): Promise<void> => {
  try {
    const { page = '1', limit = '10', search } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    let filteredResumes = resumes;
    
    // Simple search functionality
    if (search) {
      filteredResumes = resumes.filter(resume => 
        resume.name.toLowerCase().includes(search.toLowerCase()) ||
        resume.title.toLowerCase().includes(search.toLowerCase()) ||
        (resume.skills && resume.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase())))
      );
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
  } catch (error) {
    console.error('Error in getAllResumes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes'
    });
  }
};

// Get resume by ID
export const getResumeById = async (
  req: Request<ResumeParams>,
  res: Response<ApiResponse<Resume>>
): Promise<void> => {
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
  } catch (error) {
    console.error('Error in getResumeById:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume'
    });
  }
};

// Create new resume
export const createResume = async (
  req: TypedRequest<CreateResumeRequest>,
  res: Response<ApiResponse<Resume>>
): Promise<void> => {
  try {
    const { name, email, title, summary, experience, skills, education } = req.body;
    
    // Basic validation
    if (!name || !email || !title) {
      res.status(400).json({
        success: false,
        error: 'Name, email, and title are required'
      });
      return;
    }
    
    const newResume: Resume = {
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
  } catch (error) {
    console.error('Error in createResume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create resume'
    });
  }
};

// Update resume
export const updateResume = async (
  req: Request<ResumeParams, ApiResponse<Resume>, UpdateResumeRequest>,
  res: Response<ApiResponse<Resume>>
): Promise<void> => {
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
    
    const updatedResume: Resume = {
      ...resumes[resumeIndex]!,
      ...req.body,
      id: parseInt(id, 10), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    resumes[resumeIndex] = updatedResume;
    
    res.json({
      success: true,
      data: updatedResume,
      message: 'Resume updated successfully'
    });
  } catch (error) {
    console.error('Error in updateResume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resume'
    });
  }
};

// Delete resume
export const deleteResume = async (
  req: Request<ResumeParams>,
  res: Response<ApiResponse<null>>
): Promise<void> => {
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
  } catch (error) {
    console.error('Error in deleteResume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume'
    });
  }
};

// AI-powered resume analysis
export const analyzeResume = async (
  req: TypedRequest<AnalysisRequest & { industryFocus?: string; includeKeywords?: boolean }>,
  res: Response<ApiResponse<ResumeAnalysis>>
): Promise<void> => {
  try {
    const { resumeContent, industryFocus, includeKeywords } = req.body;
    
    if (!resumeContent) {
      res.status(400).json({
        success: false,
        error: 'Resume content is required'
      });
      return;
    }
    
    // Use OpenAI service for analysis
    const result = await openaiService.analyzeResume({
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
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume'
    });
  }
};

// AI-powered resume enhancement
export const enhanceResume = async (
  req: TypedRequest<EnhancementRequest & { tone?: 'professional' | 'casual' | 'technical'; improvements?: string[] }>,
  res: Response<ApiResponse<ResumeEnhancement>>
): Promise<void> => {
  try {
    const { resumeContent, targetRole, tone, improvements } = req.body;
    
    if (!resumeContent) {
      res.status(400).json({
        success: false,
        error: 'Resume content is required'
      });
      return;
    }
    
    // Use OpenAI service for enhancement
    const result = await openaiService.enhanceResume({
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
  } catch (error) {
    console.error('Error in enhanceResume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enhance resume'
    });
  }
};

// Match resume to job description
export const matchJobDescription = async (
  req: TypedRequest<JobMatchRequest & { focusAreas?: string[] }>,
  res: Response<ApiResponse<JobMatchAnalysis>>
): Promise<void> => {
  try {
    const { resumeContent, jobDescription, focusAreas } = req.body;
    
    if (!resumeContent || !jobDescription) {
      res.status(400).json({
        success: false,
        error: 'Both resume content and job description are required'
      });
      return;
    }
    
    // Use OpenAI service for job matching
    const result = await openaiService.matchJobDescription({
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
  } catch (error) {
    console.error('Error in matchJobDescription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to match resume to job description'
    });
  }
};

// New endpoint: Get custom AI suggestions
export const getCustomSuggestions = async (
  req: TypedRequest<{ resumeContent: string; criteria: string; temperature?: number; maxTokens?: number }>,
  res: Response<ApiResponse<{ suggestions: string; criteria: string }>>
): Promise<void> => {
  try {
    const { resumeContent, criteria, temperature, maxTokens } = req.body;
    
    if (!resumeContent || !criteria) {
      res.status(400).json({
        success: false,
        error: 'Resume content and criteria are required'
      });
      return;
    }
    
    // Use OpenAI service for custom suggestions
    const result = await openaiService.getCustomSuggestions(resumeContent, criteria, {
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
  } catch (error) {
    console.error('Error in getCustomSuggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate custom suggestions'
    });
  }
};
