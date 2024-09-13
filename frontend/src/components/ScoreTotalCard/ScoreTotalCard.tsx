import { FrameworkScores } from '../../types/framework';

const ScoreTotalCard = ({
  scoreDetails,
}: {
  scoreDetails: FrameworkScores | undefined;
}) => {
  return (
    <div className='bg-ecom-card-bg-light border-black border-[1px] shadow-ecom-card py-4 px-8 rounded-xl font-title flex flex-col'>
      <h3 className='mb-8 font-bold text-xl'>Overall ESG Score</h3>
      <p className='font-extrabold mx-auto text-6xl text-center flex-1 flex items-center mb-12'>{scoreDetails?.scores.total}</p>
    </div>
  )
}

export default ScoreTotalCard;