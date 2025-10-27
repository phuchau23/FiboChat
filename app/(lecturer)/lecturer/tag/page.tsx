"use client";
import { tags } from "@/utils/data";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

type Tag = {
  id: string;
  name: string;
};

export const TagTable: React.FC = () => {
  const [tagList, setTagList] = useState<Tag[]>(tags);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim()) {
      const newTagItem = { id: Date.now().toString(), name: newTag.trim() };
      setTagList((prev) => [...prev, newTagItem]);
      setNewTag("");
    }
  };

  const removeTag = (id: string) => {
    setTagList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
      <h2 className="text-[#fa7a1c] text-xl font-bold mb-4 flex items-center gap-2">🏷️ Tag Management</h2>

      {/* Input thêm tag */}
      <div className="flex gap-2 mb-5">
        <input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add new tag..."
          className="flex-1 px-4 py-2 border border-[#fa7a1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa7a1c]/50 transition"
        />
        <button
          onClick={addTag}
          className="bg-[#fa7a1c] text-white rounded-lg px-4 flex items-center gap-1 hover:bg-[#e96c10] transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Danh sách tag */}
      {tagList.length === 0 ? (
        <p className="text-gray-500 italic text-sm">No tags available. Add one above ✨</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {tagList.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center bg-[#fff7f1] text-[#fa7a1c] px-3 py-1 rounded-full shadow-sm border border-[#fa7a1c]/30 group hover:bg-[#fa7a1c] hover:text-white transition cursor-pointer"
              >
                <span className="font-medium text-sm">{tag.name}</span>
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-2 rounded-full p-0.5 bg-transparent group-hover:bg-white/20 hover:bg-white/30 transition"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default TagTable;
