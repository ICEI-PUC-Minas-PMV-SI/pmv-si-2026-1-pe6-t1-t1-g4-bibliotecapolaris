import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Theme';
import { ActionButton } from '@/components/Global/ActionButton';

type ReviewModalProps = {
  visible: boolean;
  bookTitle?: string;
  onClose: () => void;
  onSubmit: (rating: number, description: string) => Promise<void>;
};

function StarSelector({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text
            style={[
              styles.star,
              { color: star <= rating ? Colors.buttonActive : Colors.text, opacity: star <= rating ? 1 : 0.3 },
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function ReviewModal({ visible, bookTitle, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;

    setSubmitting(true);
    try {
      await onSubmit(rating, description);
      setRating(0);
      setDescription('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>AVALIAR LIVRO{bookTitle ? ` - ${bookTitle.toUpperCase()}` : ''}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>NOTA</Text>
            <StarSelector rating={rating} onChange={setRating} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>COMENTÁRIO</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Escreva sua avaliação..."
              placeholderTextColor={Colors.text + '60'}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </View>

          <View style={styles.buttons}>
            <ActionButton title="Cancelar" variant="outline" onPress={onClose} style={styles.button} />
            <ActionButton
              title={submitting ? 'Enviando...' : 'Enviar'}
              disabled={submitting || rating === 0}
              onPress={handleSubmit}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    gap: 20,
    padding: 24,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.text,
    backgroundColor: Colors.foreground,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  field: {
    gap: 8,
    alignItems: 'center',
  },
  label: {
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 36,
  },
  input: {
    width: '100%',
    height: 120,
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.text,
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: Colors.fairground + '10',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
