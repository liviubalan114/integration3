# GitHub Instructions & Project Guidelines

## Project Overview
**Project Name**: Integration3 - MoMu Fashion Museum Interactive Longread  
**Type**: Web Development Project (SECOND YEAR DEVINE 2 2025-2026)  
**Client**: MoMu – Fashion Museum Antwerp  
**Tech Stack**: TypeScript, Vite, HTML, CSS, JavaScript, GSAP, ScrollTrigger  
**Project Theme**: "Dress to Impress" - Interactive Fashion Designer Stories

---

## Project Brief: MoMu Fashion Museum

### About the Client
**MoMu** houses the largest collection of contemporary Belgian fashion in the world and creates immersive fashion exhibitions. They cultivate curiosity about fashion, making it accessible to all. Fashion is a prism to look at the world from different angles.

- **Website**: https://www.momu.be/en/
- **Instagram**: https://www.instagram.com/momuantwerp/
- **2024 Visitors**: 115,000 (one of the better-performing Antwerp city museums)

### The Collection
- **38,000+ pieces**: Clothing, accessories, textiles, tools, machines, patterns, fashion show invitations
- Focus on Belgian designers and Royal Academy of Fine Arts Antwerp alumni
- Largest and most important collection of contemporary Belgian fashion worldwide
- **Library**: 15,000+ books, hundreds of magazines, digital database of images

### The Mission
Create an **interactive online experience** through an immersive story about a fashion designer. Transform static narratives into contemporary, sensory digital experiences that:
- Excite people about visiting the museum
- Attract new visitors who haven't added MoMu to their wish list
- Teach background knowledge about fashion and designers
- Act as both educational content and promotional tool

### Your Assignment
Design and develop **one interactive longread** (one-pager) featuring a fashion designer. This is the first of 6 stories to be published throughout the year, each with a unique look and feel.

#### Choose Your Designer
Select ONE from:
- **Walter Van Beirendonk**
- **Christian Dior**
- **Dirk Bikkembergs**

#### Key Requirements

**Content & Storytelling:**
- Use MoMu's existing stories as a starting point, then develop your own angle
- Focus on specific period, body of work, collection, or unexpected perspective
- Designer and their work must remain central
- Include: archival photos, iconic pieces, design sketches, fabric swatches, interview excerpts, design process, behind-the-scenes moments
- Teach visitors about: design process, techniques, concept vs wearability, how they challenged conventions, cultural context, aesthetic evolution
- Integrate technical knowledge with interactive elements
- Longread format: longer texts telling a cohesive story

**Design Requirements:**
- Create visually engaging atmosphere aligned with client and story
- Responsive design (mobile-first approach)
- Tailor design to your specific story
- May deviate from MoMu branding to fit story, but respect logo and tone of voice
- Design should be compatible with MoMu's identity
- Use images from museum and historical materials, but integrate them into your graphic approach
- **Visual language must be YOUR creation** - AI only for supportive refinement, NOT as designer
- All materials processed into your own graphic style
- No templates - create contemporary web experience

**Development Requirements:**
- Create immersive experience - swept into the story
- Link animations and transitions to user interactions
- Use **GSAP & ScrollTrigger** (Creative Code 3 techniques)
- Make right technical choices: CSS, GSAP, Lottie, video, etc.
- Interactive elements for learning, playing, discovering
- **Performance**: Optimize responsive images (filetype & size)
- Use **Vite** to bundle JavaScript and CSS
- Manage dependencies via **npm**
- Works consistently in **Safari & Chrome** (desktop & mobile)
- Apply **progressive enhancement** principles

**Technical Stack:**
- Vite + TypeScript
- GSAP + ScrollTrigger for animations
- Responsive images optimization
- npm dependency management

**Git Requirements:**
- Private GitHub repository
- Deploy online
- Invite collaborators: **wouterverweirder** and **SimonVanherweghe**
- Use **GitHub Flow** workflow
- Main branch = always working code
- Sufficient logical feature branches and commits
- Clear commit messages
- **COMMIT OFTEN** - After each logical change (installed dependency, added section, fixed bug, etc.)
- Commit message format: `feat: add hero section` or `fix: mobile layout` or `chore: install GSAP`

**AI Usage Policy:**
- Allowed for development BUT must explain everything
- Be critical - don't just accept AI suggestions
- Official documentation takes precedence
- For design: AI only supportive, not as designer
- Transparency mandatory - document workflow

### Target Audience
- Adults (with or without children)
- Families, researchers, tourists, students
- Culture enthusiasts and new Antwerp residents
- People interested in fashion and design

### Resources
- Existing stories: https://www.momu.be/en/stories
- Study collection (online database - testing phase)
- The Antwerp 6 exhibition
- Exhibition "Girls"
- Guided visits: https://www.momu.be/en/schools/expo-visit-collection

### Deadlines & Deliverables

**Weekly:**
- Fill in weekly Figjam template (planning, self-reflection, P2P)
- Submit Toggl report (track hours with tags)

**Interim:**
- January 9: Online pitch presentation
- Figjam board copy with self-assessment & planning

**Final:**
- End Result URL (deployed online)
- GitHub project URL
- Source files (code)
- Screencast (mp4, h264/h265)
- Source files (design)
- Design process jpegs + end result jpegs
- **Late submission (24h): 33% point loss**

**Important:** Project must remain unchanged after deadline. Project not online = zero score.

### Evaluation Criteria
- See rubric: End Result URL
- See rubric: Pitch presentation
- Feedback incorporation from consultations and peers
- Self-critical approach

---

## Project Structure

```
Integration3/
├── index.html              # Root HTML file (Momu project)
├── package.json            # Root package configuration
├── css/                    # Stylesheets
│   ├── reset.css
│   ├── snippets.css
│   ├── style_backup.css
│   └── style.css
├── js/                     # JavaScript files
│   ├── gsap.js
│   └── script.js
├── assets/                 # Static assets
└── integration3/           # Vite + TypeScript sub-project
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── public/
    └── src/
        ├── counter.ts
        ├── main.ts
        └── style.css
```

---

## Development Guidelines

### When Working on This Project:

1. **Dual Structure Recognition**
   - Root level: Traditional HTML/CSS/JS project (Momu)
   - `integration3/` folder: Modern Vite + TypeScript setup
   - Always clarify which part of the project you're working on

2. **File Path Precision**
   - Always use absolute paths when using tools
   - Workspace root: `/Users/liviub/Documents/SECOND YEAR DEVINE 2 2025-2026/integration3/Integration3`
   - Be explicit about which `index.html` or config file you're editing

3. **Technology Stack**
   - **Root Project**: Plain HTML, CSS, JavaScript with GSAP
   - **integration3/ Sub-project**: Vite, TypeScript, modern build tools
   - Don't mix technologies between the two projects

4. **Code Style & Conventions**
   - Follow existing indentation and formatting in each file
   - TypeScript files: Use proper typing, avoid `any`
   - CSS: Maintain existing class naming conventions
   - JavaScript: Keep consistent with project style

5. **Making Changes**
   - Read context before editing
   - Include 3-5 lines of surrounding code when replacing strings
   - Use `multi_replace_string_in_file` for multiple independent edits
   - Test changes mentally before implementing

6. **File Operations**
   - Only create files that are essential to the user's request
   - Don't create unnecessary documentation files unless asked
   - Preserve existing file structure unless instructed otherwise

7. **Progressive Enhancement Approach (CRITICAL)**
   - **ALL content must be visible at every layer** - even with features disabled
   - Build in layers:
     1. **HTML first** (index.html): All content accessible, readable structure, proper semantic markup
     2. **Then CSS**: Visual styling, layout, positioning - **DO ALL LAYOUT WITH CSS**
     3. **Then JavaScript**: Interactive features and dynamic behavior
     4. **Finally GSAP**: Advanced animations and scroll effects **ONLY**
   - **CRITICAL**: Don't let GSAP position or layout content - CSS handles all positioning
   - GSAP is for animation enhancement only, not structural layout
   - Each layer enhances the previous one WITHOUT hiding content
   - Must be able to navigate and see all content with JavaScript disabled
   - Use regular default styles first, then enhance
   - Test by disabling: JavaScript off → CSS off → should still see all content
   - Content accessibility is priority - animations are enhancements only
   - **Build everything functional FIRST, then add GSAP animations last**

8. **Mobile-First Responsive Design**
   - Write base CSS for mobile screens first
   - Use `min-width` media queries to enhance for larger screens
   - Test constantly on mobile devices or dev tools
   - **Key breakpoints:**
     - Base: 0-767px (mobile)
     - `@media (min-width: 768px)`: tablet
     - `@media (min-width: 1024px)`: desktop
   - **What actually matters:** Mobile experience must be excellent, regardless of design order

9. **Handling Responsive Elements**
   - **Elements that change position/size:** Use CSS transform, positioning in media queries
   - **Elements that appear/disappear:** Use `display: none` on mobile, `display: block` on desktop (or vice versa)
   - **Different elements per device:** Create separate HTML elements with device-specific classes:
     ```html
     <div class="shape-mobile"><!-- Mobile version --></div>
     <div class="shape-desktop"><!-- Desktop version --></div>
     ```
   - Hide/show with CSS:
     ```css
     .shape-mobile { display: block; }
     .shape-desktop { display: none; }
     
     @media (min-width: 1024px) {
       .shape-mobile { display: none; }
       .shape-desktop { display: block; }
     }
     ```

10. **Planning Space for ScrollTrigger/Scrollytelling**
    - Plan section heights BEFORE adding GSAP
    - Use CSS to create proper spacing - GSAP animates within that space
    - **Height guidelines:**
      - Normal sections: `min-height: 100vh`
      - Sections with scroll animations: `min-height: 150vh - 200vh`
      - Pinned/sticky sections: `min-height: 200vh+`
    - **Use CSS Custom Properties for easy adjustments:**
      ```css
      :root {
        --section-height: 100vh;
        --animated-section-height: 200vh;
        --spacing-small: 2rem;
        --spacing-medium: 4rem;
        --spacing-large: 6rem;
      }
      
      .story-section {
        min-height: var(--section-height);
        padding: var(--spacing-medium) var(--spacing-small);
      }
      
      .animated-section {
        min-height: var(--animated-section-height);
      }
      
      @media (min-width: 1024px) {
        :root {
          --spacing-small: 3rem;
          --spacing-medium: 6rem;
          --spacing-large: 10rem;
        }
      }
      ```

11. **CSS Organization Best Practices**
    - Use CSS variables for colors, spacing, typography
    - Group related styles together
    - Comment your sections clearly
    - Structure order: Variables → Reset → Base → Layout → Components → Animations → Media Queries
    - **ALL measurements must be in REM** (except vh for viewport heights)
    - Convert px to rem: divide by 16 (e.g., 16px = 1rem, 32px = 2rem, 1200px = 75rem)
    - Use relative units for scalability and accessibility

---

## Before You Start Coding - Technical Setup

### Initial Setup
- [ ] Set up Git repository (private)
- [ ] Invite collaborators: wouterverweirder, SimonVanherweghe
- [ ] Install dependencies (npm install)
- [ ] Install GSAP: `npm install gsap`
- [ ] Plan folder structure
- [ ] Define CSS custom properties (colors, spacing, breakpoints from design)

### Development Order
1. **HTML Structure** → All content, semantic markup
2. **CSS Layout & Styling** → Mobile first, then media queries
3. **Basic JavaScript** → Interactive elements (non-animation)
4. **GSAP Animations** → Final enhancement layer

### Testing Checklist
- [ ] Test with JavaScript disabled → Content still visible?
- [ ] Test on actual mobile device
- [ ] Test in Safari (desktop & mobile)
- [ ] Test in Chrome (desktop & mobile)
- [ ] Check image optimization and load times
- [ ] Verify all git commits are logical and clear

---

## Commands & Workflows

### Vite Project (integration3/)
```bash
cd integration3/
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

### Installing GSAP
```bash
cd integration3/
npm install gsap
```

### Root Project
- Simple HTML project, open `index.html` directly or use a local server

---

## Commands & Workflows

### Vite Project (integration3/)
```bash
cd integration3/
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Root Project
- Simple HTML project, open `index.html` directly or use a local server

---

## Communication Guidelines

### When Responding:
- **Be concise**: Keep responses short for simple queries
- **Be direct**: Implement changes rather than just suggesting them
- **Avoid unnecessary framing**: Skip "I will now..." or "Here's what..."
- **Use markdown links**: Format file references as `[file.ts](file.ts)` or `[file.ts#L10](file.ts#L10)`
- **No emojis**: Unless explicitly requested
- **Confirm actions**: Briefly acknowledge completed operations

### File References:
- ✅ [integration3/src/main.ts](integration3/src/main.ts#L10)
- ✅ See [css/style.css](css/style.css) for styling
- ❌ `src/main.ts` (no backticks for files)
- ❌ "in the main.ts file on line 10" (use links)

---

## Task Management

For complex multi-step work:
1. Break down into actionable steps
2. Use `manage_todo_list` to track progress
3. Mark tasks as `in-progress` when starting
4. Mark tasks as `completed` immediately after finishing
5. Maintain one in-progress task at a time

Skip task tracking for simple, single-step operations.

---

## Common Scenarios

### Scenario 1: "Add a new feature"
1. Read relevant files for context
2. Understand existing code structure
3. Implement feature following existing patterns
4. Test mentally for correctness

### Scenario 2: "Fix styling issue"
1. Identify which CSS file to edit (root vs integration3)
2. Read current styles
3. Make targeted changes
4. Preserve existing formatting

### Scenario 3: "Setup new component"
1. Determine correct location (root vs integration3)
2. Follow existing file structure
3. Use appropriate technology (vanilla JS vs TypeScript)
4. Integrate with existing code

---

## Important Reminders

- **Don't create summary markdown files** unless requested
- **Implement, don't just suggest** - take action with tools
- **Research thoroughly** - gather all needed context before acting
- **Complete tasks fully** - don't stop halfway or hand back prematurely
- **Parallelize independent operations** - batch reads and searches when possible
- **Preserve user's work** - never overwrite without understanding the code

---

## Project-Specific Notes

### Root Project (Momu)
- Uses GSAP for animations
- Has backup CSS file (`style_backup.css`)
- References `ml.js` in HTML but file not visible in structure

### integration3 Sub-project
- Standard Vite + TypeScript boilerplate
- Counter example included
- Clean starting point for TypeScript development

---

