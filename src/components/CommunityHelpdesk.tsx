import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  PlusCircle, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  MapPin, 
  Send, 
  Sparkles,
  Tractor,
  AlertTriangle,
  X,
  Share2
} from 'lucide-react';
import { CommunityPost, FarmerProfile, Language } from '../types/index.ts';
import { translations } from '../utils/translations.ts';

interface CommunityHelpdeskProps {
  farmer: FarmerProfile | null;
  language: Language;
  onOpenLogin: () => void;
}

export const CommunityHelpdesk: React.FC<CommunityHelpdeskProps> = ({
  farmer,
  language,
  onOpenLogin,
}) => {
  const t = translations[language];

  const [searchHelpdeskQuery, setSearchHelpdeskQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string>('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New post form state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTagType, setNewPostTagType] = useState<'urgent' | 'sharing' | 'tip' | 'general'>('urgent');

  // Expanded replies state
  const [expandedPostId, setExpandedPostId] = useState<string | null>('post-1');
  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({});

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'post-1',
      author: 'Ramesh Rao',
      village: 'Anakapalle Rural',
      mandal: 'Anakapalle',
      role: 'Farmer',
      tag: 'Urgent Help',
      tagType: 'urgent',
      title: 'Yellow spots appearing on sugarcane leaves after rain',
      content: 'Need agronomist advice urgently. Is this red rot or micronutrient deficiency? Water stagnated for 2 days near Chodavaram canal. Leaves have spindle yellow markings.',
      helpfulCount: 14,
      userLiked: false,
      timeAgo: '2 hours ago',
      replies: [
        {
          id: 'rep-1',
          author: 'Dr. K. Apparao',
          village: 'Agricultural Research Station, Anakapalle',
          role: 'Verified Agronomist',
          text: 'Ramesh garu, this is early stage leaf chlorosis exacerbated by waterlogging. Check the midrib: if red discoloration with alcoholic odor is present, it is red rot. Spray Trichoderma viride and ensure canal drainage immediately.',
          timeAgo: '1 hour ago',
        },
        {
          id: 'rep-2',
          author: 'Suresh V.',
          village: 'Kasimkota',
          role: 'Farmer',
          text: 'Same happened in our plot last season. Applying Tricyclazole helped quickly stop the spots from spreading.',
          timeAgo: '45 mins ago',
        },
      ],
    },
    {
      id: 'post-2',
      author: 'Srinivas K.',
      village: 'Tagarapuvalasa',
      mandal: 'Bheemunipatnam',
      role: 'Farmer',
      tag: 'Resource Sharing',
      tagType: 'sharing',
      title: 'Tractor (45HP) & Rotavator Available for Daily Rent',
      content: 'Offering John Deere 45HP tractor equipped with 7-foot rotavator for dry tilling and paddy puddle preparation at subsidized farmer rates (₹750/hour with diesel & driver). Serving Bheemili and Padmanabham clusters.',
      helpfulCount: 28,
      userLiked: false,
      timeAgo: '5 hours ago',
      replies: [
        {
          id: 'rep-3',
          author: 'Venkata Ramana',
          village: 'Bheemili Rural',
          role: 'Farmer',
          text: 'Is it available this Saturday for 4 acres of field leveling? Sent you a WhatsApp message.',
          timeAgo: '3 hours ago',
        },
      ],
    },
    {
      id: 'post-3',
      author: 'Dr. K. Apparao',
      village: 'Visakhapatnam District HQ',
      mandal: 'Visakhapatnam',
      role: 'Verified Agronomist',
      tag: 'Agronomist Tip',
      tagType: 'tip',
      title: 'Weather Alert & Precautionary Steps for Visakhapatnam Belt',
      content: 'As per coastal radar, light to moderate convective rain showers are forecasted for the next 24 hours. Action: 1) Ensure clear drainage bunds in young paddy nurseries. 2) Postpone ground spray of urea. 3) Drone aerial spraying is suitable during the 8 km/h wind window tomorrow morning.',
      helpfulCount: 42,
      userLiked: true,
      timeAgo: '8 hours ago',
      replies: [
        {
          id: 'rep-4',
          author: 'G. Naidu',
          village: 'Pendurthi',
          role: 'Farmer',
          text: 'Very helpful alert. We cleared our trench drains this afternoon.',
          timeAgo: '6 hours ago',
        },
      ],
    },
  ]);

  // Toggle helpful like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.userLiked;
          return {
            ...p,
            userLiked: isLiked,
            helpfulCount: isLiked ? p.helpfulCount + 1 : p.helpfulCount - 1,
          };
        }
        return p;
      })
    );
  };

  // Add a reply
  const handleAddReply = (postId: string) => {
    const text = (replyInput[postId] || '').trim();
    if (!text) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      author: farmer ? farmer.name : 'Guest Rythu',
      village: farmer ? `${farmer.village}, ${farmer.mandal}` : 'Visakhapatnam',
      role: 'Farmer' as const,
      text,
      timeAgo: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...p.replies, newReply],
          };
        }
        return p;
      })
    );

    setReplyInput((prev) => ({ ...prev, [postId]: '' }));
  };

  // Create new post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: farmer ? farmer.name : 'Rythu Friend',
      village: farmer ? farmer.village : 'Visakhapatnam',
      mandal: farmer ? farmer.mandal : 'Anakapalle',
      role: 'Farmer',
      tag:
        newPostTagType === 'urgent'
          ? 'Urgent Help'
          : newPostTagType === 'sharing'
          ? 'Resource Sharing'
          : newPostTagType === 'tip'
          ? 'Agronomist Tip'
          : 'General Inquiry',
      tagType: newPostTagType,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      helpfulCount: 1,
      userLiked: true,
      timeAgo: 'Just now',
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesTag =
      activeTagFilter === 'all' ||
      (activeTagFilter === 'urgent' && p.tagType === 'urgent') ||
      (activeTagFilter === 'sharing' && p.tagType === 'sharing') ||
      (activeTagFilter === 'tip' && p.tagType === 'tip');

    const matchesSearch =
      !searchHelpdeskQuery.trim() ||
      p.title.toLowerCase().includes(searchHelpdeskQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchHelpdeskQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchHelpdeskQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchHelpdeskQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  return (
    <section id="community" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>THEME 3 · CROWDSOURCED PEER SUPPORT & KNOWLEDGE EXCHANGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            {t.helpdeskTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {t.helpdeskDesc}
          </p>
        </div>

        {/* Action Button: Post Problem */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!farmer) {
                onOpenLogin();
              } else {
                setIsPostModalOpen(true);
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center gap-2 cursor-pointer ring-1 ring-emerald-300/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.postProblem}</span>
          </button>
        </div>
      </div>

      {/* Filter and Helpdesk Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-[#081e14] p-3 rounded-2xl border border-emerald-900/70">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Discussions' },
            { id: 'urgent', label: '🚨 Urgent Pest Help' },
            { id: 'sharing', label: '🚜 Equipment Rentals' },
            { id: 'tip', label: '🌾 Agronomist Alerts' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTagFilter(tag.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTagFilter === tag.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/50 text-slate-300 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Dedicated Helpdesk Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchHelpdeskQuery}
            onChange={(e) => setSearchHelpdeskQuery(e.target.value)}
            placeholder={t.searchHelpdesk}
            className="w-full bg-emerald-950/90 border border-emerald-800/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl bg-gradient-to-b from-[#092218] to-[#05170f] border border-emerald-800/70 p-5 shadow-xl hover:border-emerald-600/60 transition-all"
          >
            {/* Top Post Meta */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  post.role === 'Verified Agronomist' 
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40' 
                    : 'bg-emerald-800/60 text-emerald-200 border border-emerald-600/40'
                }`}>
                  {post.role === 'Verified Agronomist' ? 'Dr' : post.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{post.author}</span>
                    {post.role === 'Verified Agronomist' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-teal-400" />
                        Verified Agronomist
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    {post.village}, {post.mandal} · {post.timeAgo}
                  </span>
                </div>
              </div>

              {/* Tag pill */}
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                post.tagType === 'urgent'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : post.tagType === 'sharing'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {post.tag}
              </span>
            </div>

            {/* Post Title & Content */}
            <h3 className="text-base font-bold text-white mt-1">
              {post.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {post.content}
            </p>

            {/* Post Actions: Helpful, Replies, Share */}
            <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    post.userLiked
                      ? 'bg-emerald-800 text-emerald-200 border-emerald-500 font-bold'
                      : 'bg-emerald-950/50 text-slate-300 border-emerald-900 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.helpfulCount} Helpful</span>
                </button>

                <button
                  onClick={() =>
                    setExpandedPostId(expandedPostId === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/50 text-slate-300 border border-emerald-900 hover:text-white transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{post.replies.length} Replies</span>
                </button>
              </div>

              {post.tagType === 'sharing' && (
                <span className="text-[11px] text-teal-300 font-mono font-semibold">
                  📞 Contact: Available on request
                </span>
              )}
            </div>

            {/* Replies section (expandable) */}
            {expandedPostId === post.id && (
              <div className="mt-4 pt-4 border-t border-emerald-900/60 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Community & Agronomist Responses ({post.replies.length})
                </h4>

                <div className="space-y-2">
                  {post.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {rep.author}
                          {rep.role === 'Verified Agronomist' && (
                            <span className="text-[10px] text-teal-300 font-semibold px-1.5 py-0.2 rounded bg-teal-950 border border-teal-800">
                              Agronomist
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">{rep.timeAgo}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{rep.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Reply Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={replyInput[post.id] || ''}
                    onChange={(e) =>
                      setReplyInput({ ...replyInput, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddReply(post.id);
                    }}
                    placeholder={farmer ? `Reply as ${farmer.name}...` : 'Type advice or question...'}
                    className="flex-1 bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleAddReply(post.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#071f15] border border-emerald-700 rounded-2xl shadow-2xl p-6 ring-1 ring-emerald-400/30">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Post Problem / Resource to Helpdesk
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'urgent' as const, label: '🚨 Urgent Pest' },
                    { id: 'sharing' as const, label: '🚜 Equipment' },
                    { id: 'general' as const, label: '💬 General Query' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewPostTagType(cat.id)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-colors ${
                        newPostTagType === cat.id
                          ? 'bg-emerald-700 text-white border-emerald-400'
                          : 'bg-emerald-950/60 text-slate-300 border-emerald-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Title / Subject <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Caterpillar pest attack on maize in Pendurthi"
                  className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Details / Description <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe your crop condition, soil status, village, or equipment rental specifications..."
                  className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Publish to Visakhapatnam Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
