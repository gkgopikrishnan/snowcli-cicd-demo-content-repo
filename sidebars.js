/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  tutorialSidebar: [
  // Entries for Snowflake - Start
  {
    type: 'category',
    label: 'Snowflake Training',
    items: [
      {
        type: 'category',
        label: '12. Deployment with CI/CD',
        items: [
          'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-01-Deployment-and-Code-Promotion-in-Snowflake',
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
          'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-03-Deployment-with-GithubActions-Schemachange',
          'snowflake-training/Module-12-Development-CICD-and-Deployment/module-12-development-cicd-and-deployment-12-04-Deployment-with-DBT'

        ],
      }
          
    ],
  },

// Entries for Snowflake - end.
  
  ],
};
