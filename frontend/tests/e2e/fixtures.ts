import { test as base, expect } from '@playwright/test';

/**
 * Extended test fixtures for Todo App
 * Use these fixtures for common setup/teardown operations
 */

// Define custom fixtures
type TodoFixtures = {
  todoPage: TodoPage;
};

// Page Object Model for Todo operations
class TodoPage {
  constructor(private page: any) {}

  // Navigate to the app
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  // Wait for todos to load
  async waitForTodosToLoad() {
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') && response.status() === 200
    );
  }

  // Create a new todo
  async createTodo(title: string, description?: string) {
    await this.page.locator('[data-testid="todo-title-input"]').fill(title);
    if (description) {
      await this.page.locator('[data-testid="todo-description-input"]').fill(description);
    }
    await this.page.locator('[data-testid="todo-submit-button"]').click();
    
    // Wait for creation
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') &&
        response.request().method() === 'POST'
    );
  }

  // Delete a todo by index
  async deleteTodo(index: number = 0) {
    await this.page.locator('[data-testid="todo-delete-button"]').nth(index).click();
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') &&
        response.request().method() === 'DELETE'
    );
  }

  // Toggle todo completion
  async toggleTodo(index: number = 0) {
    await this.page.locator('[data-testid="todo-checkbox"]').nth(index).click();
    await this.page.waitForResponse(
      (response: any) =>
        response.url().includes('/api/todos/') &&
        response.request().method() === 'PUT'
    );
  }

  // Get todo count
  async getTodoCount(): Promise<number> {
    return await this.page.locator('[data-testid="todo-item"]').count();
  }

  // Get todo by index
  getTodo(index: number) {
    return this.page.locator('[data-testid="todo-item"]').nth(index);
  }
}

// Extend base test with our fixtures
export const test = base.extend<TodoFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },
});

export { expect };
