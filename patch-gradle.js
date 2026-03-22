const fs = require('fs');
const path = require('path');

// Helper to replace content with regex
function replaceInFile(filePath, regex, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(regex, replacement);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Patched ${filePath}`);
            return true;
        }
    }
    return false;
}

// 1. Fix root build.gradle
const rootBuildGradlePath = path.join(__dirname, 'android', 'build.gradle');
// Set kotlinVersion
replaceInFile(rootBuildGradlePath, /kotlinVersion = (?:findProperty\('android\.kotlinVersion'\) \?\: '1\.8\.10'|"(?:1\.8\.10|1\.9\.22)")/, 'kotlinVersion = "1.8.10"');
// Fix dependencies
if (fs.existsSync(rootBuildGradlePath)) {
    let content = fs.readFileSync(rootBuildGradlePath, 'utf8');
    if (!content.includes('kotlin-gradle-plugin')) {
        content = content.replace(/dependencies \{/, 'dependencies {\n        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")');
        fs.writeFileSync(rootBuildGradlePath, content);
        console.log('Added kotlin-gradle-plugin to android/build.gradle');
    }
}

// 2. Fix expo-modules-core publishing bug
const expoPluginPath = path.join(__dirname, 'node_modules', 'expo-modules-core', 'android', 'ExpoModulesCorePlugin.gradle');
const publishingTarget = /release\(MavenPublication\) \{\s+from components\.release\s+\}/g;
const publishingReplacement = `release(MavenPublication) {
          def releaseComponent = components.findByName("release")
          if (releaseComponent != null) {
              from releaseComponent
          }
        }`;
replaceInFile(expoPluginPath, publishingTarget, publishingReplacement);

// 3. Ensure namespace in app/build.gradle
const appBuildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
if (fs.existsSync(appBuildGradlePath)) {
    let content = fs.readFileSync(appBuildGradlePath, 'utf8');
    if (!content.includes('namespace')) {
        replaceInFile(appBuildGradlePath, /android \{/, 'android {\n    namespace "com.nicobaruna.liburindonesia"');
    }
}

// 4. Update splash background color
const colorsPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'values', 'colors.xml');
if (fs.existsSync(colorsPath)) {
    let content = fs.readFileSync(colorsPath, 'utf8');
    if (!content.includes('splashscreen_background')) {
        content = content.replace(/<\/resources>/, '  <color name="splashscreen_background">#ffffff</color>\n</resources>');
        fs.writeFileSync(colorsPath, content);
        console.log('Added splashscreen_background to colors.xml');
    }
}

// 5. Update gradle-wrapper.properties
const wrapperPath = path.join(__dirname, 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');
replaceInFile(wrapperPath, /distributionUrl=https\\:\/\/services\.gradle\.org\/distributions\/gradle-8\.3-all\.zip/, 'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.6-all.zip');

console.log('All patches finished.');
