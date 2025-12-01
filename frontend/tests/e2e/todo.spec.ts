import { test, expect, type Page } from '@playwright/test';

async function waitForTodosToLoad(page: Page) {
  try {
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/todos') && response.status() === 200,
      { timeout: 15000 }
    );} catch {
    await page.waitForSelector('[data-testid="todo-list"]', { timeout: 10000 });
  }
}

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  }
);

  test('should display the todo app title', async ({ page }) => {
    await expect(page).toHaveTitle(/Vite|frontend/i, { timeout:     10000 });
  });

  test('should display todo list', async ({ page }) => {
    const todoList = page.locator('[data-testid="todo-list"]');
    await expect(todoList).toBeVisible({ timeout: 10000 });
  });

  test('should create a new todo', async ({ page }) => {
    const uniqueTitle = `Test Todo ${Date.now()}`;
    const titleInput = page.locator('[data-testid="todo-title-input"]');
    const submitButton = page.locator('[data-testid="todo-submit-button"]');

    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(uniqueTitle);
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    await submitButton.click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/todos') &&
        response.request().method() === 'POST' &&
        (response.status() === 200 || response.status() === 201),
      { timeout: 15000 }
    );

    await expect(page.getByText(uniqueTitle).first()).toBeVisible({ timeout: 10000 });
  });

  test('should toggle todo completion', async ({ page }) => {
    const todoTitle = `Toggle Test ${Date.now()}`;
    const titleInput = page.locator('[data-testid="todo-title-input"]');
    const submitButton = page.locator('[data-testid="todo-submit-button"]');
    
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(todoTitle);
    await submitButton.click();

    await page.waitForResponse(
      (response) => response.url().includes('/api/todos') && response.request().method() === 'POST',
      { timeout: 15000 }
    );
    await page.waitForTimeout(1000);

    const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: todoTitle });
    await expect(todoItem).toBeVisible({ timeout: 10000 });

    const checkbox = todoItem.locator('[data-testid="todo-checkbox"]');
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    const initialState = await checkbox.isChecked();
    await checkbox.click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/todos') &&
        response.request().method() === 'PUT',
      { timeout: 15000 }
    );

    await page.waitForTimeout(2000);

    const todoItemAfter = page.locator('[data-testid="todo-item"]').filter({ hasText: todoTitle });
    const checkboxAfter = todoItemAfter.locator('[data-testid="todo-checkbox"]');
    const newState = await checkboxAfter.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should delete a todo', async ({ page }) => {
    await waitForTodosToLoad(page);

    let todoItems = page.locator('[data-testid="todo-item"]');
    let count = await todoItems.count();
    
    if (count === 0) {
      const titleInput = page.locator('[data-testid="todo-title-input"]');
      await titleInput.fill('Todo to Delete');
      await page.locator('[data-testid="todo-submit-button"]').click();
      await page.waitForResponse(
        (response) => response.url().includes('/api/todos') && response.request().method() === 'POST',
        { timeout: 15000 }
      );
      await page.waitForTimeout(1000);
      count = await todoItems.count();
    }

    const initialTodos = count;

    const deleteButton = page.locator('[data-testid="todo-delete-button"]').first();
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/todos') &&
        response.request().method() === 'DELETE',
      { timeout: 15000 }
    );

    await page.waitForTimeout(1000);

    const finalTodos = await page.locator('[data-testid="todo-item"]').count();
    expect(finalTodos).toBe(initialTodos - 1);
  });

  test('should edit a todo', async ({ page }) => {
    const originalTitle = `ToEdit ${Date.now()}`;
    const updatedTitle = `Edited ${Date.now()}`;

    const titleInput = page.locator('[data-testid="todo-title-input"]');
    const submitButton = page.locator('[data-testid="todo-submit-button"]');
    
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(originalTitle);
    await submitButton.click();

    await page.waitForResponse(
      (response) => response.url().includes('/api/todos') && response.request().method() === 'POST',
      { timeout: 15000 }
    );
    await page.waitForTimeout(1000);

    const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: originalTitle });
    await expect(todoItem).toBeVisible({ timeout: 10000 });
    
    const editButton = todoItem.locator('[data-testid="todo-edit-button"]');
    await editButton.click();

    await page.waitForTimeout(1000);

    await expect(submitButton).toContainText(/Update/i, { timeout: 5000 });

    await titleInput.click();
    await titleInput.fill(''); 
    await page.waitForTimeout(200);
    await titleInput.fill(updatedTitle);
    await page.waitForTimeout(200);

    await submitButton.click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/todos') &&
        response.request().method() === 'PUT',
      { timeout: 15000 }
    );

    await page.waitForTimeout(1500);

    await expect(page.getByText(updatedTitle).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Todo Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('should not submit empty todo', async ({ page }) => {
    const submitButton = page.locator('[data-testid="todo-submit-button"]');
    const titleInput = page.locator('[data-testid="todo-title-input"]');
    
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await expect(submitButton).toBeDisabled({ timeout: 5000 });
    await expect(titleInput).toHaveAttribute('required', '');
  });
});

test.describe('API Error Handling', () => {
  test('should display error message when API fails', async ({ page }) => {
    await page.route('**/api/todos/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});
