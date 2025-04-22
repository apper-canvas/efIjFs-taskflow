/**
 * Centralized Apper service configuration
 * Provides the ApperClient instance for all data operations
 */

// Canvas ID from configuration
const CANVAS_ID = "1fdac86864ea4d7eb21a53de3f15b3a7";

// Tables from the Apper schema
export const TABLES = {
  TASKS: 'task',
  PROJECTS: 'project',
  TAGS: 'tag',
  USERS: 'User'
};

// Field names for each table
export const FIELDS = {
  TASK: {
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
    DUE_DATE: 'dueDate',
    PRIORITY: 'priority',
    STATUS: 'status',
    TAGS: 'tags',
    PROJECT_ID: 'projectId'
  },
  PROJECT: {
    ID: 'id',
    NAME: 'Name',
    COLOR: 'color'
  },
  TAG: {
    ID: 'id',
    NAME: 'Name',
    COLOR: 'color'
  },
  USER: {
    ID: 'Id',
    NAME: 'Name',
    EMAIL: 'Email',
    FIRST_NAME: 'FirstName',
    LAST_NAME: 'LastName',
    AVATAR_URL: 'AvatarUrl'
  }
};

// Get ApperClient instance
export const getApperClient = () => {
  if (!window.ApperSDK) {
    throw new Error('Apper SDK not loaded. Make sure the script is included in index.html.');
  }
  
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

// Get ApperUI for authentication
export const getApperUI = () => {
  if (!window.ApperSDK) {
    throw new Error('Apper SDK not loaded. Make sure the script is included in index.html.');
  }
  
  return window.ApperSDK.ApperUI;
};

// Export the tables and fields schema
export const apperSchema = {
  tables: [
    {
      "Id": 1828,
      "Name": "task",
      "Label": "Task",
      "Plural": "Tasks",
      "Icon": "clipboard-list",
      "fields": [
        {"Name": "Tags", "Label": "Tags", "Type": "Tag", "Id": 32169},
        {"Name": "Id", "Label": "Id", "Type": "Number", "Id": 32167},
        {"Name": "Name", "Label": "Name", "Type": "Text", "Id": 32168},
        {"Name": "Owner", "Label": "Owner", "Type": "Lookup", "Id": 32170, "DisplayFieldsOfToTable": "Name"},
        {"Name": "CreatedOn", "Label": "Created On", "Type": "DateTime", "Id": 32171},
        {"Name": "CreatedBy", "Label": "Created By", "Type": "Lookup", "Id": 32172, "DisplayFieldsOfToTable": "Name"},
        {"Name": "ModifiedOn", "Label": "Modified On", "Type": "DateTime", "Id": 32173},
        {"Name": "ModifiedBy", "Label": "Modified By", "Type": "Lookup", "Id": 32174, "DisplayFieldsOfToTable": "Name"},
        {"Name": "DeletedOn", "Label": "Deleted On", "Type": "DateTime", "Id": 32175},
        {"Name": "DeletedBy", "Label": "Deleted By", "Type": "Lookup", "Id": 32176, "DisplayFieldsOfToTable": "Name"},
        {"Name": "IsDeleted", "Label": "Is Deleted", "Type": "Boolean", "Id": 32177},
        {"Name": "InSandbox", "Label": "In Sandbox", "Type": "Boolean", "Id": 32178},
        {"Name": "id", "Label": "id", "Type": "Text", "Id": 32179},
        {"Name": "title", "Label": "title", "Type": "Text", "Id": 32180},
        {"Name": "description", "Label": "description", "Type": "MultilineText", "Id": 32181},
        {"Name": "dueDate", "Label": "dueDate", "Type": "DateTime", "Id": 32182},
        {"Name": "priority", "Label": "priority", "Type": "Picklist", "Id": 32183, "PicklistValues": "high,medium,low"},
        {"Name": "status", "Label": "status", "Type": "Picklist", "Id": 32184, "PicklistValues": "todo,inProgress,completed"},
        {"Name": "tags", "Label": "tags", "Type": "MultiPicklist", "Id": 32186},
        {"Name": "projectId", "Label": "projectId", "Type": "Lookup", "Id": 32185, "ToTable": "project", "DisplayFieldsOfToTable": "Name"}
      ]
    },
    {
      "Id": 1829,
      "Name": "project",
      "Label": "Project",
      "Plural": "Projects",
      "Icon": "folder",
      "fields": [
        {"Name": "Id", "Label": "Id", "Type": "Number", "Id": 32187},
        {"Name": "Name", "Label": "name", "Type": "Text", "Id": 32188},
        {"Name": "Tags", "Label": "Tags", "Type": "Tag", "Id": 32189},
        {"Name": "Owner", "Label": "Owner", "Type": "Lookup", "Id": 32190, "DisplayFieldsOfToTable": "Name"},
        {"Name": "CreatedOn", "Label": "Created On", "Type": "DateTime", "Id": 32191},
        {"Name": "CreatedBy", "Label": "Created By", "Type": "Lookup", "Id": 32192, "DisplayFieldsOfToTable": "Name"},
        {"Name": "ModifiedOn", "Label": "Modified On", "Type": "DateTime", "Id": 32193},
        {"Name": "ModifiedBy", "Label": "Modified By", "Type": "Lookup", "Id": 32194, "DisplayFieldsOfToTable": "Name"},
        {"Name": "DeletedOn", "Label": "Deleted On", "Type": "DateTime", "Id": 32195},
        {"Name": "DeletedBy", "Label": "Deleted By", "Type": "Lookup", "Id": 32196, "DisplayFieldsOfToTable": "Name"},
        {"Name": "IsDeleted", "Label": "Is Deleted", "Type": "Boolean", "Id": 32197},
        {"Name": "InSandbox", "Label": "In Sandbox", "Type": "Boolean", "Id": 32198},
        {"Name": "id", "Label": "id", "Type": "Text", "Id": 32199},
        {"Name": "color", "Label": "color", "Type": "Text", "Id": 32200}
      ]
    },
    {
      "Id": 1830,
      "Name": "tag",
      "Label": "Tag",
      "Plural": "Tags",
      "Icon": "tag",
      "fields": [
        {"Name": "Id", "Label": "Id", "Type": "Number", "Id": 32201},
        {"Name": "Name", "Label": "name", "Type": "Text", "Id": 32202},
        {"Name": "Tags", "Label": "Tags", "Type": "Tag", "Id": 32203},
        {"Name": "Owner", "Label": "Owner", "Type": "Lookup", "Id": 32204, "DisplayFieldsOfToTable": "Name"},
        {"Name": "CreatedOn", "Label": "Created On", "Type": "DateTime", "Id": 32205},
        {"Name": "CreatedBy", "Label": "Created By", "Type": "Lookup", "Id": 32206, "DisplayFieldsOfToTable": "Name"},
        {"Name": "ModifiedOn", "Label": "Modified On", "Type": "DateTime", "Id": 32207},
        {"Name": "ModifiedBy", "Label": "Modified By", "Type": "Lookup", "Id": 32208, "DisplayFieldsOfToTable": "Name"},
        {"Name": "DeletedOn", "Label": "Deleted On", "Type": "DateTime", "Id": 32209},
        {"Name": "DeletedBy", "Label": "Deleted By", "Type": "Lookup", "Id": 32210, "DisplayFieldsOfToTable": "Name"},
        {"Name": "IsDeleted", "Label": "Is Deleted", "Type": "Boolean", "Id": 32211},
        {"Name": "InSandbox", "Label": "In Sandbox", "Type": "Boolean", "Id": 32212},
        {"Name": "id", "Label": "id", "Type": "Text", "Id": 32213},
        {"Name": "color", "Label": "color", "Type": "Text", "Id": 32214}
      ]
    }
  ]
};

// Initial data to seed the database if empty
export const initialTasks = [
  {
    id: "task-1",
    title: "Complete project proposal",
    description: "Draft and finalize the Q3 marketing campaign proposal",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: "high",
    status: "todo",
    projectId: "project-1",
    tags: ["tag-1", "tag-3"]
  },
  {
    id: "task-2",
    title: "Review analytics dashboard",
    description: "Check performance metrics and prepare report",
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    priority: "medium",
    status: "inProgress",
    projectId: "project-2",
    tags: ["tag-2"]
  },
  {
    id: "task-3",
    title: "Team meeting preparation",
    description: "Prepare agenda and presentation for weekly team meeting",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: "low",
    status: "todo",
    projectId: "project-1",
    tags: ["tag-3"]
  },
  {
    id: "task-4",
    title: "Client call follow-up",
    description: "Send meeting notes and action items to client",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago (overdue)
    priority: "high",
    status: "completed",
    projectId: "project-3",
    tags: ["tag-4"]
  }
];

export const initialProjects = [
  { id: "project-1", Name: "Marketing Campaign", color: "#6366f1" },
  { id: "project-2", Name: "Website Redesign", color: "#ec4899" },
  { id: "project-3", Name: "Client Onboarding", color: "#06b6d4" }
];

export const initialTags = [
  { id: "tag-1", Name: "Urgent", color: "#ef4444" },
  { id: "tag-2", Name: "Research", color: "#3b82f6" }, 
  { id: "tag-3", Name: "Meeting", color: "#10b981" },
  { id: "tag-4", Name: "Client", color: "#f59e0b" }
];