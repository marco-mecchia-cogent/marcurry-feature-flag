import { ProjectRepository } from '@/lib/repositories/project-repository';
import { ProjectNotFoundError } from '@marcurry/core';
import type { Project, ProjectId } from '@marcurry/core';

export class ProjectService {
  private projectRepo: ProjectRepository;

  constructor() {
    this.projectRepo = new ProjectRepository();
  }

  async getProject(id: ProjectId): Promise<Project> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new ProjectNotFoundError(id);
    }
    return project;
  }

  async listProjects(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  async createProject(data: { name: string }): Promise<Project> {
    return this.projectRepo.create(data);
  }

  async updateProject(id: ProjectId, data: { name?: string }): Promise<Project> {
    const existing = await this.getProject(id);
    return this.projectRepo.update(id, data);
  }

  async deleteProject(id: ProjectId): Promise<void> {
    await this.getProject(id);
    await this.projectRepo.delete(id);
  }
}
