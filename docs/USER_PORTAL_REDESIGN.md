# 🎨 Get-Jobs User Portal Redesign

I have completely redesigned the **Get-Jobs** user portal to a modern, professional light theme.

## 🎨 Design System

**Theme:**
- **Background:** `bg-gray-50` (#F9FAFB) - Soft, professional background
- **Cards:** `bg-white` with `shadow-sm` and `border-gray-200`
- **Primary Color:** `text-blue-600` / `bg-blue-600`
- **Text:** `text-gray-900` (Headings) & `text-gray-600` (Body)
- **Icons:** `lucide-react` (Vector icons)

## 📄 Pages Updated

### **1. 🔐 Authentication (Login & Register)**
- **New Look:** Clean centered cards with `shadow-xl`.
- **Icons:** Added `User`, `Mail`, `Lock` icons inside input fields.
- **Feedback:** Error messages have red backgrounds and icons.

### **2. 🏠 Dashboard (Home)**
- **Welcome Banner:** Gradient banner greeting the user.
- **Quick Actions:** Cards for "Browse Jobs" and "My Applications" with large illustrative icons.
- **Navigation:** proper sticky header with user dropdown/logout.

### **3. 🔍 Job Search (JobsList)**
- **Search Bar:** Large, centered search input with icon.
- **Job Cards:** Clean white cards with:
  - **Icons:** MapPin, Briefcase, BarChart for metadata.
  - **Tags:** Skills and deadlines with colored badges.
  - **Hover Effects:** Subtle shadow and border transition.

### **4. 📄 Job Details (JobDetail)**
- **Header:** Sticky header with "Apply Now" button.
- **Structure:** Clear sections for Description, Skills, Education, etc. using grid layouts.
- **Typography:** Improved readability with `prose` classes (simulated).

### **5. 📂 My Applications**
- **List View:** Table-like card layout showing job info and status.
- **Status Badges:** Colored badges (e.g., Yellow for Shortlisted, Blue for Pending) with icons.
- **Empty State:** Friendly illustration when no applications exist.

### **6. 📝 Application Modal**
- **Step 1 (Resume):** Drag-and-drop zone for PDF upload. 
- **Step 2 (Video):** Integrated video recorder.
- **Design:** Clean step-by-step wizard feel.

### **7. 🎥 Video Interview**
- **Interface:** Dark mode video area (cinema feel) with clear recording controls.
- **Instructions:** Sidebar with clear tips and question list.
- **Feedback:** Pulse animation while recording.

---

## 🚀 How to Test

1. **Login:** Try logging in with a user account.
2. **Dashboard:** You will see the new dashboard layout.
3. **Browse:** Go to "Browse Jobs" to see the new list.
4. **Apply:** Click a job -> Apply Now -> Upload Resume -> Record Video.
5. **Track:** Go to "My Applications" to see the status.

The application is now visually consistent with the Admin Panel but tailored for candidates! ✨
