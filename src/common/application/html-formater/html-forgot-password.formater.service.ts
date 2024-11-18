import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export class TemplateHandler {
  static generateTemplate(templatePath: string, placeholders: Record<string, string>): string {
    const template = readFileSync(join(process.cwd(), templatePath), {
      encoding: 'utf8',
    });
    let customizedTemplate = template;
    for (const [placeholder, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      customizedTemplate = customizedTemplate.replace(regex, value);
    }

    return customizedTemplate;
  }
}
