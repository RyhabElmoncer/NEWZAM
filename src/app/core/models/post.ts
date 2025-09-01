
export interface Post {
  id?: number,
  slug?: string;
  title?: string,
  author?: string,
  content?: string,
  comments?: number,
  description?: string;
  imageUrl?: string;
  isVisible?: boolean;
 // blocs?: IBloc[];
  date?: any;
 // writer?: IActeur;
  type?: string
  blog_categories: Array<{
    name: string;
    slug: string;
  }>
  image: Array<{
    width: string;
    height: string;
    url: string;
  }>
}
