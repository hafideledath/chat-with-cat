import React, { useState } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  text-align: center;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border: 3px solid #000;
  background-color: #f0e6d2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
`;

const AvatarImage = styled.div`
  font-size: 4rem;
`;

const UserName = styled.h3`
  font-size: 1.8rem;
  margin: 10px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const StatCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 15px;
  text-align: center;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #6f4e37;
  margin: 10px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
  margin: 15px 0;
  overflow: hidden;
  border: 2px solid #000;
`;

const Progress = styled.div`
  width: ${props => props.value}%;
  height: 100%;
  background-color: #6f4e37;
`;

const LanguageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 15px 0;
`;

const LanguageBadge = styled.div`
  background-color: #f0e6d2;
  border: 2px solid #000;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const AchievementSection = styled.div`
  margin: 30px 0;
`;

const AchievementList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
`;

const AchievementBadge = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #000;
  background-color: ${props => props.unlocked ? '#f0e6d2' : '#eee'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.unlocked ? '2.5rem' : '1.5rem'};
  opacity: ${props => props.unlocked ? 1 : 0.5};
  position: relative;
`;

const AchievementTooltip = styled.div`
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  
  ${AchievementBadge}:hover & {
    opacity: 1;
  }
`;

const SettingsSection = styled.div`
  margin: 30px 0;
`;

const SettingsForm = styled.form`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 3px solid #000;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #6f4e37;
  color: #fff;
  border: 2px solid #000;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  align-self: center;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

// Mock user data
const userData = {
  name: 'Language Learner',
  avatar: '👤',
  wordsLearned: 127,
  daysStreak: 14,
  languages: [
    { name: 'Spanish', level: 'Intermediate', progress: 65, icon: '🇪🇸' },
    { name: 'French', level: 'Beginner', progress: 30, icon: '🇫🇷' },
    { name: 'Italian', level: 'Beginner', progress: 15, icon: '🇮🇹' },
  ],
  achievements: [
    { id: 1, name: 'First Word', icon: '🔤', unlocked: true, description: 'Learn your first word' },
    { id: 2, name: '7 Day Streak', icon: '🔥', unlocked: true, description: 'Practice 7 days in a row' },
    { id: 3, name: 'Polyglot', icon: '🌍', unlocked: true, description: 'Learn words in 3 different languages' },
    { id: 4, name: 'Word Master', icon: '📚', unlocked: false, description: 'Learn 500 words' },
    { id: 5, name: 'Drawing Pro', icon: '🎨', unlocked: false, description: 'Complete 50 drawings' },
  ]
};

const Profile = () => {
  const [user, setUser] = useState(userData);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    avatar: user.avatar,
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: formData.name,
      avatar: formData.avatar,
    }));
    setEditMode(false);
  };
  
  const avatarOptions = ['👤', '👩', '👨', '🐱', '🐶', '🦊', '🐻', '🦁', '🐼', '🐨'];
  
  return (
    <ProfileContainer>
      <h2>Your Profile</h2>
      
      <ProfileHeader>
        <ProfileAvatar>
          <AvatarImage>{user.avatar}</AvatarImage>
        </ProfileAvatar>
        <UserName>{user.name}</UserName>
        <Button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Cancel' : 'Edit Profile'}
        </Button>
      </ProfileHeader>
      
      {editMode ? (
        <SettingsSection>
          <h3>Edit Profile</h3>
          <SettingsForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Display Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="avatar">Choose Avatar</Label>
              <Select 
                id="avatar" 
                name="avatar" 
                value={formData.avatar}
                onChange={handleInputChange}
              >
                {avatarOptions.map(avatar => (
                  <option key={avatar} value={avatar}>{avatar}</option>
                ))}
              </Select>
            </FormGroup>
            
            <Button type="submit">Save Changes</Button>
          </SettingsForm>
        </SettingsSection>
      ) : (
        <>
          <StatsGrid className="profile-stats">
            <StatCard className="stat-card">
              <h3>Words Learned</h3>
              <StatValue>{user.wordsLearned}</StatValue>
              <ProgressBar>
                <Progress value={(user.wordsLearned / 500) * 100} />
              </ProgressBar>
              <p>Goal: 500 words</p>
            </StatCard>
            
            <StatCard className="stat-card">
              <h3>Day Streak</h3>
              <StatValue>{user.daysStreak}</StatValue>
              <p>Keep practicing daily!</p>
            </StatCard>
            
            <StatCard className="stat-card">
              <h3>Languages</h3>
              <LanguageList>
                {user.languages.map(lang => (
                  <LanguageBadge key={lang.name}>
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                    <span>({lang.level})</span>
                  </LanguageBadge>
                ))}
              </LanguageList>
            </StatCard>
          </StatsGrid>
          
          <AchievementSection>
            <h3>Achievements</h3>
            <AchievementList>
              {user.achievements.map(achievement => (
                <AchievementBadge 
                  key={achievement.id} 
                  unlocked={achievement.unlocked}
                >
                  {achievement.icon}
                  <AchievementTooltip>
                    {achievement.name}: {achievement.description}
                  </AchievementTooltip>
                </AchievementBadge>
              ))}
            </AchievementList>
          </AchievementSection>
          
          {user.languages.map(language => (
            <div key={language.name}>
              <h3>{language.icon} {language.name} Progress</h3>
              <ProgressBar>
                <Progress value={language.progress} />
              </ProgressBar>
              <p>{language.progress}% Complete</p>
            </div>
          ))}
        </>
      )}
    </ProfileContainer>
  );
};

export default Profile;
