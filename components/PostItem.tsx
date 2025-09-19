import { CardStyle, Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type PostStatus = 'success' | 'failure';

export type PostItemProps = {
  id?: string;
  status: PostStatus;
  iconUrl: string;
  nickname: string;
  title: string;
  comment: string;
  timestamp: string;
  likes?: number;
  onLike?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
};

export default function PostItem({ 
  id, 
  status, 
  iconUrl, 
  nickname, 
  title, 
  comment, 
  timestamp, 
  likes = 0, 
  onLike, 
  onEdit, 
  onDelete, 
  isOwner = false 
}: PostItemProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
    if (onLike) onLike();
  };

  const handleEdit = () => {
    if (id && onEdit) {
      onEdit(id);
      setShowMenu(false);
    }
  };

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id);
      setShowMenu(false);
    }
  };

  return (
    <View style={[styles.card, CardStyle]}>
      <View style={[styles.statusBar, { backgroundColor: status === 'success' ? Colors.successColor : Colors.failureColor }]} />
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <View style={styles.infoArea}>
        <View style={styles.headerRow}>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerRight}>
            <Text style={styles.timestamp}>{timestamp}</Text>
            {isOwner && (
              <TouchableOpacity 
                style={styles.menuBtn} 
                onPress={() => setShowMenu(!showMenu)}
              >
                <Text style={styles.menuText}>⋮</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.comment}>{comment}</Text>
        <View style={styles.actionRow}>
          <Text style={styles.actionText}>コメント</Text>
          <TouchableOpacity 
            style={styles.likeBtn} 
            onPress={handleLike}
          >
            <Text style={{ fontSize: 18, color: liked ? '#e74c3c' : '#bbb', marginRight: 4 }}>❤️</Text>
            <Text style={styles.likeCount}>{likeCount}</Text>
          </TouchableOpacity>
        </View>
        {showMenu && isOwner && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text style={styles.menuItemText}>編集</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={[styles.menuItemText, styles.deleteText]}>削除</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.subtleTextColor,
    marginRight: 16,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 18,
    color: Colors.primaryGreen,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 15,
    color: Colors.primaryGreen,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 12,
    position: 'relative',
  },
  statusBar: {
    width: 8,
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    marginLeft: 16,
    backgroundColor: Colors.borderColor,
  },
  infoArea: {
    flex: 1,
    marginLeft: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.textColor,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    color: Colors.subtleTextColor,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.subtleTextColor,
    marginRight: 8,
  },
  menuBtn: {
    padding: 4,
  },
  menuText: {
    fontSize: 18,
    color: Colors.subtleTextColor,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: Colors.textColor,
  },
  deleteText: {
    color: Colors.failureColor,
  },
  comment: {
    fontSize: 15,
    color: Colors.textColor,
    marginTop: 2,
  },
});
