const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'tests/e2e',timeout:45000,workers:1,fullyParallel:false,
  reporter:[['list'],['json',{outputFile:'qa/browser-results.json'}]],
  use:{headless:true,viewport:{width:1440,height:1000},locale:'de-DE',
    launchOptions:{...(process.env.PIXELWERK_CHROMIUM?{executablePath:process.env.PIXELWERK_CHROMIUM}:{}),args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PIXELWERK_SINGLE_PROCESS?['--single-process','--no-zygote','--disable-gpu']:[])]},
    screenshot:'only-on-failure',trace:'retain-on-failure'
  }
});
