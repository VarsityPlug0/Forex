export type Block =
  | { t: 'intro'; text: string }
  | { t: 'heading'; text: string }
  | { t: 'text'; text: string }
  | { t: 'bullets'; title?: string; items: string[] }
  | { t: 'numbered'; title?: string; items: string[] }
  | { t: 'callout'; variant: 'info' | 'warning' | 'tip' | 'key'; title?: string; text: string }
  | { t: 'table'; headers: string[]; rows: string[][] }
  | { t: 'example'; title: string; body: string }
  | { t: 'steps'; title?: string; steps: { title: string; body: string }[] }
  | { t: 'compare'; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { t: 'formula'; label: string; formula: string; explanation?: string }
  | { t: 'takeaways'; items: string[] }
  | { t: 'visual'; title: string; rows: { label: string; value: string; color?: string }[] }
  | { t: 'diagram'; visualType: string; caption?: string }

export type RichLesson = {
  title: string
  duration: string
  blocks: Block[]
}
