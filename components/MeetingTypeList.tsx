'use client';
import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import DatePicker from 'react-datepicker';
import { Input } from './ui/input';

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isInstantMeeting' | 'isJoiningMeeting' | undefined
  >();
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: 'Please select a date and time',
          variant: 'destructive',
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) {
        throw new Error('Failed to create call');
      }
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || 'Instant Meeting';

      await call.getOrCreate({
        data: { starts_at: startsAt, custom: { description: description } },
      });
      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Failed to create meeting',
        variant: 'destructive',
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2  xl:grid-cols-4'>
      <HomeCard
        img='/icons/add-meeting.svg'
        title='New Meeting'
        description='Start an instant meeting'
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='via invitation link'
        className='bg-blue-1'
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img='/icons/schedule.svg'
        title='Schedule Meeting'
        description='Plan your meeting'
        className='bg-purple-1'
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img='/icons/recordings.svg'
        title='View Recordings'
        description='Meeting Recordings'
        className='bg-yellow-1'
        handleClick={() => router.push('/recordings')}
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          className='text-center'
          title='Schedule a Meeting'
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base font-normal leading-[22px] text-sky-2'>
              Add description
            </label>
            <Textarea
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none'
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              value={values.description}
              placeholder=' Add Meeting description'
            />
          </div>
          <div className='flex w-full flex-col gap-2.5'>
            <label className='text-base font-normal leading-[22px] text-sky-2'>
              Select Date and Time
            </label>
            <DatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              dateFormat='MMMM d, yyyy h:mm aa'
              timeCaption='Time'
              className='w-full rounded bg-dark-3 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Meeting Scheduled'
          className='text-center'
          buttonText='Copy Link'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: 'Meeting Link Copied to Clipboard',
              variant: 'default',
            });
          }}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
        />
      )}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Enter Meeting Link'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={() => {
          const sanitizedLink = values.link.replace(window.location.origin, '');
          router.push(sanitizedLink);
        }}
      >
        <Input
          placeholder='Meeting Link'
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
          onChange={(e) => {
            const rawLink = e.target.value;
            const sanitizedLink = rawLink.replace(window.location.origin, '');
            setValues({ ...values, link: sanitizedLink });
          }}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
