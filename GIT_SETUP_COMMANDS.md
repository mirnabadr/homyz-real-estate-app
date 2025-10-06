# Git Repository Setup Commands for Homyz 🏡

Follow these commands to set up your professional GitHub repository for the Homyz real estate app.

## 🚀 Initial Repository Setup

### 1. Initialize Git Repository
```bash
# Navigate to your project directory
cd /Users/mirnabadr/Desktop/reactnative_realestate

# Initialize git repository
git init

# Set default branch to main
git branch -M main
```

### 2. Add All Files to Staging
```bash
# Add all files to staging area
git add .

# Check status to see what's being added
git status
```

### 3. Create Professional Initial Commit
```bash
# Create initial commit with professional message
git commit -m "feat: initial commit - Homyz real estate mobile app

🏡 Homyz - Modern Real Estate Mobile App

- Complete React Native + Expo application
- TypeScript implementation with type safety
- Appwrite backend integration
- Advanced property management features
- User authentication and profiles
- Image galleries with carousel navigation
- Review and rating system
- Agent integration and management
- Search and filtering capabilities
- Cross-platform compatibility (iOS/Android)
- Modern UI/UX with NativeWind styling
- Professional code structure and documentation

Tech Stack:
- React Native 0.81.4
- Expo SDK 54
- TypeScript 5.9.2
- NativeWind 4.2.1
- Appwrite Backend
- Expo Router navigation

Ready for production deployment and job showcase."
```

### 4. Add Remote Origin
```bash
# Add GitHub remote origin
git remote add origin https://github.com/mirnabadr/homyz-real-estate-app.git

# Verify remote is added correctly
git remote -v
```

### 5. Push to GitHub
```bash
# Push to main branch on GitHub
git push -u origin main
```

## 🔄 Additional Setup Commands

### Create and Push to Develop Branch
```bash
# Create develop branch
git checkout -b develop

# Push develop branch to GitHub
git push -u origin develop
```

### Set Up Branch Protection (GitHub Web Interface)
1. Go to your repository on GitHub
2. Navigate to Settings → Branches
3. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

### Create Release Tags
```bash
# Create and push version tag
git tag -a v1.0.0 -m "Release v1.0.0 - Initial Homyz App Release"
git push origin v1.0.0
```

## 📁 Repository Structure Verification

After setup, your repository should have:

```
homyz-real-estate-app/
├── .github/
│   └── workflows/
│       └── ci.yml
├── app/
├── components/
├── lib/
├── constants/
├── assets/
├── .gitignore
├── .env.example
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── package.json
└── tsconfig.json
```

## 🎯 Professional Repository Features

### GitHub Repository Settings
1. **Description**: "🏡 Homyz - Modern Real Estate Mobile App built with React Native, Expo, and TypeScript"
2. **Topics**: `react-native`, `expo`, `real-estate`, `mobile-app`, `typescript`, `appwrite`, `cross-platform`
3. **Website**: Your portfolio URL (if available)
4. **Visibility**: Public (for job applications)

### Repository Badges
The README.md includes professional badges for:
- React Native
- Expo
- TypeScript
- Appwrite
- NativeWind

### Documentation
- Comprehensive README with screenshots placeholders
- Detailed CONTRIBUTING.md guidelines
- MIT License
- Professional .gitignore
- CI/CD pipeline with GitHub Actions

## 🔧 Post-Setup Verification

### Verify Repository
```bash
# Check repository status
git status

# View commit history
git log --oneline

# Verify remote connection
git remote -v

# Check branch information
git branch -a
```

### Test CI/CD Pipeline
1. Make a small change to README.md
2. Commit and push changes
3. Verify GitHub Actions workflow runs successfully
4. Check that all quality gates pass

## 📱 Screenshots Setup

Create a `screenshots/` directory and add placeholder files:

```bash
# Create screenshots directory
mkdir screenshots

# Add placeholder files (replace with actual screenshots later)
touch screenshots/home-screen.png
touch screenshots/property-details.png
touch screenshots/explore-screen.png

# Add to git
git add screenshots/
git commit -m "docs: add screenshot placeholders for README"
git push origin main
```

## 🚀 Deployment Preparation

### Environment Variables
Create `.env.example` file:
```bash
# Create environment variables template
cat > .env.example << 'EOF'
# Appwrite Configuration
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=your_properties_collection_id
EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID=your_agents_collection_id
EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID=your_galleries_collection_id
EOF

# Add to git
git add .env.example
git commit -m "docs: add environment variables template"
git push origin main
```

## ✅ Final Checklist

- [ ] Repository initialized with git
- [ ] All files committed with professional message
- [ ] Remote origin added and pushed
- [ ] README.md is comprehensive and professional
- [ ] LICENSE file added
- [ ] CONTRIBUTING.md guidelines created
- [ ] .gitignore properly configured
- [ ] package.json updated with professional metadata
- [ ] GitHub Actions CI/CD pipeline configured
- [ ] Screenshots directory created
- [ ] Environment variables template added
- [ ] Repository is public and properly documented

## 🎉 Success!

Your Homyz repository is now ready for job applications! The repository showcases:

- **Professional documentation** and code organization
- **Modern React Native architecture** with TypeScript
- **Comprehensive CI/CD pipeline** for code quality
- **Detailed contribution guidelines** for open source collaboration
- **Production-ready setup** with proper environment configuration

This repository will impress potential employers and demonstrate your expertise in:
- React Native and Expo development
- TypeScript and modern JavaScript
- Backend integration with Appwrite
- Professional development practices
- Open source contribution management
- CI/CD and DevOps practices
