import CategoryScoreBar from '../CategoryScoreBar';
import { FrameworkScores } from '../../types/framework';

const ScoreBreakdownCard = ({
  scoreDetails,
}: {
  scoreDetails: FrameworkScores | undefined;
}) => {
  return (
    <div className='bg-ecom-card-bg-light border-black border-[1px] shadow-ecom-card py-4 px-8 rounded-xl'>
      <h3 className='font-title font-bold text-xl mb-3'>Score Breakdown</h3>

      {/* Key */}
      <div className='mb-3 flex items-center text-sm'>
        <div className='flex items-center mr-8'>
          <svg className='mr-2' width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="6" height="18" fill="#4D8323"/>
            <rect width="6" height="18" transform="translate(8)" fill="#2E6D90"/>
            <rect width="6" height="18" transform="translate(16)" fill="#A44B2F"/>
          </svg>
          <p>Category Scores</p>
        </div>

        <div className='flex items-center mr-3'>
          <div 
            className='mr-2 w-6 h-5 bg-[#B7B7B7]'
          ></div>
          <p>Industry Mean</p>
        </div>
      </div>

      <CategoryScoreBar
        category='E'
        score={scoreDetails?.scores.environmental.value || 0}
        industryMean={scoreDetails?.scores.environmental.industryMean || 0}
      />

      <CategoryScoreBar
        category='S'
        score={scoreDetails?.scores.social.value || 0}
        industryMean={scoreDetails?.scores.social.industryMean || 0}
      />

      <CategoryScoreBar
        category='G'
        score={scoreDetails?.scores.governance.value || 0}
        industryMean={scoreDetails?.scores.governance.industryMean || 0}
      />
      
    </div>
  )
}

export default ScoreBreakdownCard;