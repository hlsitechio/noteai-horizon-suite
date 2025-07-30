
export interface Folder {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderFilters {
  parentId?: string;
}
