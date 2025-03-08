import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import replace from 'replace-in-file';
import inquirer from 'inquirer';
import chalk from 'chalk';
import os from 'os';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES模块中的__dirname替代方案）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义可能的LM Studio安装路径
const getPossiblePaths = () => {
  const platform = os.platform();
  const homedir = os.homedir();
  
  if (platform === 'darwin') { // macOS
    return [
      '/Applications/LM Studio.app/Contents/Resources/app',
      path.join(homedir, 'Applications/LM Studio.app/Contents/Resources/app')
    ];
  } else if (platform === 'win32') { // Windows
    return [
      path.join(homedir, 'AppData/Local/LM-Studio/resources/app'),
      path.join(homedir, 'AppData/Local/Programs/LM-Studio/resources/app'),
      path.join('C:/Program Files/LM-Studio/resources/app'),
      path.join('C:/Program Files (x86)/LM-Studio/resources/app')
    ];
  } else { // Linux或其他平台
    console.log(chalk.yellow('警告: 当前平台可能不受支持，但我们会尝试查找LM Studio安装目录。'));
    return [
      path.join(homedir, '.local/share/LM-Studio/resources/app'),
      '/opt/LM-Studio/resources/app',
      '/usr/local/LM-Studio/resources/app'
    ];
  }
};

// 查找有效的LM Studio安装路径
const findValidPaths = async () => {
  const possiblePaths = getPossiblePaths();
  const validPaths = [];
  
  for (const p of possiblePaths) {
    try {
      if (await fs.pathExists(p)) {
        validPaths.push(p);
      }
    } catch (err) {
      // 忽略错误，继续检查下一个路径
    }
  }
  
  return validPaths;
};

// 自定义路径输入
const promptCustomPath = async () => {
  const { customPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customPath',
      message: '请输入LM Studio安装目录的完整路径:',
      validate: async (input) => {
        if (!input) return '路径不能为空';
        try {
          const exists = await fs.pathExists(input);
          return exists ? true : '指定的路径不存在';
        } catch (err) {
          return '无效的路径';
        }
      }
    }
  ]);
  
  return customPath;
};

// 选择安装路径
const selectPath = async (validPaths) => {
  if (validPaths.length === 0) {
    console.log(chalk.yellow('未找到LM Studio安装目录，请手动指定。'));
    return await promptCustomPath();
  }
  
  if (validPaths.length === 1) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `找到LM Studio安装目录: ${validPaths[0]}，是否使用该路径?`,
        default: true
      }
    ]);
    
    if (confirm) {
      return validPaths[0];
    } else {
      return await promptCustomPath();
    }
  }
  
  // 多个有效路径，让用户选择
  const { selectedPath } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPath',
      message: '找到多个可能的LM Studio安装目录，请选择:',
      choices: [
        ...validPaths,
        new inquirer.Separator(),
        '手动指定路径'
      ]
    }
  ]);
  
  if (selectedPath === '手动指定路径') {
    return await promptCustomPath();
  }
  
  return selectedPath;
};

// 执行替换操作
const performReplacement = async (appPath) => {
  try {
    // 优先查找所有JS和TSX文件（重点文件）
    const jsAndTsxFiles = await glob('**/*.{js,tsx}', { 
      cwd: appPath, 
      absolute: true,
      ignore: ['**/node_modules/**']
    });
    
    // 其他可能包含URL的文件类型
    const otherFiles = await glob('**/*.{json,html,css,ts}', { 
      cwd: appPath, 
      absolute: true,
      ignore: ['**/node_modules/**']
    });
    
    const files = [...jsAndTsxFiles, ...otherFiles];
    
    if (files.length === 0) {
      console.log(chalk.yellow('警告: 在指定目录中未找到任何可处理的文件。'));
      return false;
    }
    
    console.log(chalk.blue(`找到 ${jsAndTsxFiles.length} 个JS/TSX文件和 ${otherFiles.length} 个其他文件，开始替换...`));
    
    // 执行替换 - 完整URL替换
    const urlOptions = {
      files: files,
      from: /https:\/\/huggingface\.co/g,
      to: 'https://hf-mirror.com',
      countMatches: true
    };
    
    // 执行替换 - 可能的相对路径或其他格式的URL
    const relativeOptions = {
      files: jsAndTsxFiles, // 只在JS和TSX文件中查找这些模式
      from: [
        /['"]huggingface\.co['"]/g,  // 字符串形式的域名
        /[^https:]\/\/huggingface\.co/g,  // 不带https:的URL
        /huggingface\.co\//g  // 域名后跟斜杠的形式
      ],
      to: [
        "'hf-mirror.com'",
        "//hf-mirror.com",
        "hf-mirror.com/"
      ],
      countMatches: true
    };
    
    const urlResults = await replace(urlOptions);
    const relativeResults = await replace(relativeOptions);
    
    let totalReplaced = 0;
    let jsAndTsxReplaced = 0;
    
    console.log(chalk.blue('\n处理完整URL替换:'));
    urlResults.forEach(result => {
      if (result.hasChanged) {
        console.log(chalk.green(`已修改: ${path.relative(appPath, result.file)} (${result.numReplacements} 处替换)`));
        totalReplaced += result.numReplacements;
        
        // 统计JS和TSX文件的替换数量
        if (result.file.endsWith('.js') || result.file.endsWith('.tsx')) {
          jsAndTsxReplaced += result.numReplacements;
        }
      }
    });
    
    console.log(chalk.blue('\n处理其他格式URL替换:'));
    relativeResults.forEach(result => {
      if (result.hasChanged) {
        console.log(chalk.green(`已修改: ${path.relative(appPath, result.file)} (${result.numReplacements} 处替换)`));
        totalReplaced += result.numReplacements;
        jsAndTsxReplaced += result.numReplacements; // 这些都是JS和TSX文件
      }
    });
    
    if (totalReplaced > 0) {
      console.log(chalk.green(`\n替换完成! 共替换了 ${totalReplaced} 处 huggingface.co 为 hf-mirror.com`));
      console.log(chalk.green(`其中JS和TSX文件中替换了 ${jsAndTsxReplaced} 处`));
      return true;
    } else {
      console.log(chalk.yellow('未找到需要替换的内容。可能该应用已经使用了镜像地址或使用了不同的URL格式。'));
      return false;
    }
  } catch (error) {
    console.error(chalk.red('替换过程中发生错误:'), error);
    return false;
  }
};

// 备份文件
const backupFiles = async (appPath) => {
  const backupDir = path.join(os.tmpdir(), `lmstudio-backup-${Date.now()}`);
  
  try {
    console.log(chalk.blue(`正在创建备份到: ${backupDir}`));
    await fs.copy(appPath, backupDir);
    console.log(chalk.green('备份创建成功!'));
    return backupDir;
  } catch (error) {
    console.error(chalk.red('创建备份时发生错误:'), error);
    return null;
  }
};

// 恢复备份
const restoreBackup = async (backupDir, appPath) => {
  try {
    console.log(chalk.blue(`正在从备份恢复: ${backupDir}`));
    await fs.copy(backupDir, appPath, { overwrite: true });
    console.log(chalk.green('恢复成功!'));
    return true;
  } catch (error) {
    console.error(chalk.red('恢复备份时发生错误:'), error);
    return false;
  }
};

// 主函数
const main = async () => {
  console.log(chalk.cyan('===== LM Studio 镜像切换工具 ====='));
  console.log(chalk.cyan('该工具将帮助您将 huggingface.co 替换为 hf-mirror.com\n'));
  
  // 查找有效路径
  const validPaths = await findValidPaths();
  const selectedPath = await selectPath(validPaths);
  
  console.log(chalk.blue(`选择的LM Studio路径: ${selectedPath}`));
  
  // 确认操作
  const { confirmAction } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmAction',
      message: '是否继续替换操作? 建议在操作前关闭LM Studio。',
      default: true
    }
  ]);
  
  if (!confirmAction) {
    console.log(chalk.yellow('操作已取消。'));
    return;
  }
  
  // 创建备份
  const { createBackup } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'createBackup',
      message: '是否在替换前创建备份?',
      default: true
    }
  ]);
  
  let backupDir = null;
  if (createBackup) {
    backupDir = await backupFiles(selectedPath);
    if (!backupDir) {
      const { continueWithoutBackup } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueWithoutBackup',
          message: '备份创建失败，是否继续替换操作?',
          default: false
        }
      ]);
      
      if (!continueWithoutBackup) {
        console.log(chalk.yellow('操作已取消。'));
        return;
      }
    }
  }
  
  // 执行替换
  const success = await performReplacement(selectedPath);
  
  if (success) {
    console.log(chalk.green('\n操作成功完成!'));
    console.log(chalk.green('现在您可以启动LM Studio，它将使用 hf-mirror.com 作为模型下载源。'));
  } else {
    console.log(chalk.yellow('\n替换操作未完成或未找到需要替换的内容。'));
    
    if (backupDir) {
      const { restore } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'restore',
          message: '是否恢复备份?',
          default: true
        }
      ]);
      
      if (restore) {
        await restoreBackup(backupDir, selectedPath);
      }
    }
  }
  
  if (backupDir) {
    console.log(chalk.blue(`\n备份保存在: ${backupDir}`));
    console.log(chalk.blue('如果需要手动恢复，可以将该目录中的文件复制回LM Studio安装目录。'));
  }
};

// 运行主函数
main().catch(err => {
  console.error(chalk.red('发生错误:'), err);
  process.exit(1);
}); 