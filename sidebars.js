/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  tutorialSidebar: [
  // Entries for Snowflake - Start
  {
    type: 'category',
    label: 'Webinar Content',
    items: [
      // First module at top level
      'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-01-Deployment-and-Code-Promotion-in-Snowflake',
  
      // Remaining Deployment with CI/CD content
      {
        type: 'category',
        label: 'Deployment with CI/CD',
        items: [
          {
            type: 'category',
            label: 'Deployment using SnowCLI',
            items: [
              'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-02-01-Deployment-with-GithubActions-What-is-SnowCLI',
              'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-02-02-Deployment-with-GithubActions-Set-up-SnowCLI-in-Local',
              'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-02-03-Deployment-with-GithubActions-Set-up-CICD-Workflow',
              'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-02-04-Deployment-with-GithubActions-Promote-to-Next-Env',
              'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-02-05-Deployment-with-GithubActions-Set-up-SnowCLI-Dockerized'
            ],
          },
          'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-03-Deployment-with-GithubActions-Schemachange'
        ],
      },
  
      // Webinar Videos
      {
        type: 'category',
        label: 'Webinar Videos',
        items: [
          'demo-videos/Part-01-Introduction-Setup',
          'demo-videos/Part-02-Set-up-Directories-Databases',
          'demo-videos/Part-03-Git-Init-Basic-CICD-Workflow',
          'demo-videos/Part-04-Workflow-with-Secrets-CICD-workflow-for-UAT',
        ],
      }
    ],
  }
  

// Entries for Snowflake - end.
  
  ],
};
