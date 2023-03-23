import { FlyDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';

export default async function runExecutor(options: FlyDeployExecutorSchema) {
  const cwd = options.distLocation;
  const results = execSync(`fly apps list`, { encoding: 'utf-8' });
  console.log(results);
  if (results.includes(options.flyAppName)) {
    console.log('DEPLOYING');
    execSync(`fly deploy`, { cwd, stdio: 'inherit' });
  } else {
    console.log('MAKING APP');
    // consult https://fly.io/docs/reference/regions/ to get best region for you
    execSync(`fly launch --now --name=${options.flyAppName} --region=ams`, {
      cwd,
      stdio: 'inherit',
    });
  }
  return {
    success: true,
  };
}

