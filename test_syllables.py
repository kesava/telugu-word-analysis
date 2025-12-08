#!/usr/bin/env python3
"""
Test script to validate Telugu syllable extraction logic
This mirrors the JavaScript implementation to ensure correctness
"""

def is_consonant(char):
    """Check if character is a Telugu consonant"""
    return '\u0C15' <= char <= '\u0C39'

def is_vowel(char):
    """Check if character is a Telugu vowel"""
    return '\u0C05' <= char <= '\u0C14'

def is_vowel_sign(char):
    """Check if character is a Telugu vowel sign (matra)"""
    return '\u0C3E' <= char <= '\u0C4C'

def is_virama(char):
    """Check if character is Telugu virama (halanta)"""
    return char == '\u0C4D'

def extract_syllables(word):
    """
    Extract Telugu syllables from a word
    Based on the logic implemented in analyze.js
    """
    syllables = []
    current_syllable = ''

    for i, char in enumerate(word):
        next_char = word[i + 1] if i + 1 < len(word) else None

        if is_consonant(char):
            # Start a new syllable with consonant
            if current_syllable and not is_virama(current_syllable[-1]):
                syllables.append(current_syllable)
                current_syllable = ''
            current_syllable += char

            # Add inherent 'a' sound if no vowel sign follows
            if not next_char or (not is_vowel_sign(next_char) and not is_virama(next_char)):
                # Only add inherent vowel if it's not followed by virama
                if not is_virama(next_char):
                    # Consonant with inherent 'a' - complete syllable
                    pass

        elif is_vowel(char):
            # Independent vowel - complete syllable
            if current_syllable:
                syllables.append(current_syllable)
            current_syllable = char
            syllables.append(current_syllable)
            current_syllable = ''

        elif is_vowel_sign(char):
            # Vowel sign - add to current consonant
            current_syllable += char

        elif is_virama(char):
            # Virama - add to current consonant (conjunct)
            current_syllable += char

        else:
            # Other characters (numbers, punctuation, etc.)
            if current_syllable:
                syllables.append(current_syllable)
                current_syllable = ''
            if char.strip():
                syllables.append(char)

    # Add remaining syllable
    if current_syllable:
        syllables.append(current_syllable)

    return syllables

def test_syllable_extraction():
    """Test syllable extraction with various Telugu words"""
    test_words = [
        'మనిషి',    # ma-ni-shi
        'కమలం',     # ka-ma-lam
        'వాక్యం',    # vak-yam (with conjunct)
        'అమ్మ',      # am-ma (with conjunct)
        'ప్రేమ',     # pre-ma
        'స్నేహం',    # sne-ham
        'ప్రకృతి',   # pra-kru-ti
        'సంస్కృతి',  # sam-skru-ti
    ]

    print("Testing Telugu Syllable Extraction:")
    print("=" * 50)

    for word in test_words:
        syllables = extract_syllables(word)
        print(f"Word: {word}")
        print(f"Syllables: {syllables}")
        print(f"Count: {len(syllables)}")
        print("-" * 30)

    return test_words

def analyze_sample_words():
    """Analyze syllable patterns in sample words"""
    test_words = test_syllable_extraction()

    # Count syllable frequencies
    syllable_freq = {}
    total_syllables = 0

    for word in test_words:
        syllables = extract_syllables(word)
        total_syllables += len(syllables)

        for syllable in syllables:
            if syllable.strip():
                syllable_freq[syllable] = syllable_freq.get(syllable, 0) + 1

    print("\nSyllable Frequency Analysis:")
    print("=" * 50)

    # Sort by frequency
    sorted_syllables = sorted(syllable_freq.items(), key=lambda x: x[1], reverse=True)

    for syllable, count in sorted_syllables:
        percentage = (count / total_syllables) * 100
        print(f"'{syllable}': {count} times ({percentage:.1f}%)")

    print(f"\nTotal unique syllables: {len(syllable_freq)}")
    print(f"Total syllable occurrences: {total_syllables}")
    print(f"Average syllables per word: {total_syllables / len(test_words):.2f}")

if __name__ == "__main__":
    analyze_sample_words()