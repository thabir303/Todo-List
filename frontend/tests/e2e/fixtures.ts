import { test as base, expect } from '@playwright/test';

 
type TodoFixtures = {
  todoPage: TodoPage;
};

 
class TodoPage {
  constructor(private page: any) {}

  
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  
  async waitForTodosToLoad() {
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') && response.status() === 200
    );
  }

  
  async createTodo(title: string, description?: string) {
    await this.page.locator('[data-testid="todo-title-input"]').fill(title);
    if (description) {
      await this.page.locator('[data-testid="todo-description-input"]').fill(description);
    }
    await this.page.locator('[data-testid="todo-submit-button"]').click();
    
    
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') &&
        response.request().method() === 'POST'
    );
  }

  
  async deleteTodo(index: number = 0) {
    await this.page.locator('[data-testid="todo-delete-button"]').nth(index).click();
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') &&
        response.request().method() === 'DELETE'
    );
  }

  
  async toggleTodo(index: number = 0) {
    await this.page.locator('[data-testid="todo-checkbox"]').nth(index).click();
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') &&
        response.request().method() === 'PUT'
    );
  }

  
  async getTodoCount(): Promise<number> {
    return await this.page.locator('[data-testid="todo-item"]').count();
  }

  
  getTodo(index: number) {
    return this.page.locator('[data-testid="todo-item"]').nth(index);
  }
}

 
export const test = base.extend<TodoFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },
});

export { expect };
