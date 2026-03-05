import fs from "node:fs/promises";
import path from "node:path";

export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf8");
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  if (!(await exists(dir))) {
    await fs.mkdir(dir, { recursive: true });
  }
  await fs.writeFile(filePath, content, "utf8");
}

export async function readJson<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath);
  return JSON.parse(content);
}

export async function writeJson(filePath: string, data: any): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function listFiles(dirPath: string): Promise<string[]> {
  return await fs.readdir(dirPath);
}

export async function mkdir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function deleteFile(filePath: string): Promise<void> {
  await fs.unlink(filePath);
}
